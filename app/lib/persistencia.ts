"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Estado que sobrevive a recargar la página, guardado en el navegador.
 *
 * Existe porque el anotador y el convertidor lo necesitan, y porque la forma obvia de hacerlo
 * está mal de dos maneras distintas:
 *
 * **1. Leer `localStorage` en el valor inicial de `useState` rompe la hidratación.** Ese
 * inicializador también corre en el servidor, donde `localStorage` no existe; y aun salvando eso,
 * el HTML que genera el servidor (sin la partida guardada) no coincide con el primer render del
 * cliente (con la partida guardada), y React lo reporta como error de hidratación.
 *
 * **2. Leerlo en un `useEffect` y llamar a `setState` está prohibido por el linter de React 19**
 * (`react-hooks/set-state-in-effect`), y con razón: provoca una cascada de renders. Los efectos
 * son para sincronizar con sistemas externos, no para inicializar estado.
 *
 * La herramienta correcta es `useSyncExternalStore`, que existe justamente para leer de un
 * sistema externo con un valor distinto en servidor y en cliente sin que eso sea un conflicto:
 * React hace las dos pasadas a propósito y sin avisar de nada.
 *
 * De regalo, como `subscribe` escucha el evento `storage`, el estado queda sincronizado **entre
 * pestañas**: si tenés el anotador abierto en dos, las dos muestran el mismo puntaje.
 */

type Almacen<T> = {
  subscribe: (oyente: () => void) => () => void;
  leerCliente: () => T;
  leerServidor: () => T;
  guardar: (valor: T) => void;
};

function crearAlmacen<T>(clave: string, inicial: T, validar: (crudo: unknown) => T | null): Almacen<T> {
  const oyentes = new Set<() => void>();

  const notificar = () => {
    for (const oyente of oyentes) oyente();
  };

  /*
   * `leerCliente` tiene que devolver **la misma referencia** mientras el valor no cambie. Si
   * devolviera un objeto nuevo en cada llamada, React vería un cambio en cada render y entraría
   * en un bucle infinito. Por eso se cachea usando el string crudo como testigo: si el texto
   * guardado no cambió, se devuelve el objeto ya parseado.
   */
  let cache: { crudo: string | null; valor: T } | null = null;

  const leerCrudo = (): string | null => {
    try {
      return window.localStorage.getItem(clave);
    } catch {
      // Almacenamiento bloqueado (pasa en modo privado de algunos navegadores).
      return null;
    }
  };

  return {
    subscribe(oyente) {
      oyentes.add(oyente);
      // El evento `storage` sólo lo disparan las **otras** pestañas, así que los cambios
      // propios se avisan a mano desde `guardar`.
      window.addEventListener("storage", notificar);
      return () => {
        oyentes.delete(oyente);
        window.removeEventListener("storage", notificar);
      };
    },

    leerCliente() {
      const crudo = leerCrudo();
      if (cache && cache.crudo === crudo) return cache.valor;

      let valor = inicial;
      if (crudo !== null) {
        try {
          valor = validar(JSON.parse(crudo)) ?? inicial;
        } catch {
          // Valor corrupto: se arranca de cero en vez de dejar la herramienta rota.
          valor = inicial;
        }
      }
      cache = { crudo, valor };
      return valor;
    },

    // En el servidor no hay nada guardado, así que el HTML se genera con el valor inicial.
    leerServidor() {
      return inicial;
    },

    guardar(valor) {
      try {
        window.localStorage.setItem(clave, JSON.stringify(valor));
      } catch {
        // Sin espacio o bloqueado: la herramienta sigue andando, sólo no recuerda.
      }
      // Se invalida la cache y se avisa, para que este render tome el valor nuevo.
      cache = null;
      notificar();
    },
  };
}

/**
 * Devuelve `[valor, guardar]` con el valor persistido en el navegador.
 *
 * `validar` recibe lo que había guardado ya parseado y tiene que devolver `null` si no sirve.
 * Es obligatorio y no opcional a propósito: lo guardado puede ser de una versión anterior del
 * código, o editado a mano desde la consola, y confiar en su forma es cómo se rompe una
 * herramienta sin entender por qué.
 */
export function usePersistido<T>(
  clave: string,
  inicial: T,
  validar: (crudo: unknown) => T | null,
): [T, (siguiente: T | ((previo: T) => T)) => void] {
  // El almacén se crea una sola vez por clave: si se recreara en cada render, la cache interna
  // no serviría de nada.
  const almacen = useMemo(() => crearAlmacen(clave, inicial, validar), [clave, inicial, validar]);

  const valor = useSyncExternalStore(almacen.subscribe, almacen.leerCliente, almacen.leerServidor);

  const guardar = useCallback(
    (siguiente: T | ((previo: T) => T)) => {
      const resuelto =
        typeof siguiente === "function"
          ? (siguiente as (previo: T) => T)(almacen.leerCliente())
          : siguiente;
      almacen.guardar(resuelto);
    },
    [almacen],
  );

  return [valor, guardar];
}

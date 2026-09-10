"use client";

import { useEffect, useRef } from "react";

/**
 * Las brasas que suben en el hero.
 *
 * ## Por qué está escrito a mano y no con una librería
 *
 * El pedido era un fondo con partículas. La respuesta habitual es `tsparticles`, que medido son unos
 * 40 KB comprimidos más un motor de configuración que no vamos a usar. Esto son unas cuarenta líneas
 * y **menos de 2 KB**, y a cambio se controla exactamente el presupuesto de trabajo por cuadro, que
 * es lo que decide si un teléfono de gama media se calienta o no.
 *
 * El sitio recibe tráfico pago desde teléfonos. Duplicar el JavaScript de la página para un efecto
 * de fondo se paga en conversión, y el fondo no es lo que convierte.
 *
 * ## Por qué brasas y no puntos
 *
 * La dirección de arte describe la Kripta como piedra volcánica con luz saliendo de ranuras. Brasas
 * subiendo lento pertenecen a ese lugar; un campo de puntos conectados por líneas es el fondo de
 * cualquier sitio de tecnología y no dice nada del sujeto.
 *
 * ## Lo que hace que no moleste
 *
 * - **Respeta `prefers-reduced-motion`.** Si la persona pidió menos movimiento, el canvas no se
 *   dibuja y no se registra ningún cuadro. Un fondo animado es justo lo que arruina la visita a
 *   alguien sensible al movimiento, así que acá no es una casilla que tachar.
 * - **Se detiene cuando la pestaña no se ve.** Sin esto sigue consumiendo batería de fondo, que es
 *   el error más común de estos efectos.
 * - **Se detiene cuando el hero salió de la pantalla.** Nadie lo está viendo: seguir dibujando es
 *   gastar batería para nadie.
 * - **Densidad atada al área**, con un techo. En un monitor ancho no aparecen cientos de brasas.
 * - `aria-hidden` y sin foco: es atmósfera, no contenido.
 */
export function Brasas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo) return;

    // Si pidió menos movimiento, no se dibuja nada. Ni un cuadro.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = lienzo.getContext("2d");
    if (!ctx) return;

    let ancho = 0;
    let alto = 0;
    let cuadro = 0;
    let visible = true;

    type Brasa = { x: number; y: number; r: number; v: number; giro: number; alfa: number };
    let brasas: Brasa[] = [];

    // Se limita a 1.5 para no multiplicar el trabajo por cuatro en pantallas de alta densidad. La
    // diferencia visual en un desenfoque de 2px de radio no se ve; la de rendimiento sí.
    const densidad = Math.min(window.devicePixelRatio || 1, 1.5);

    function medir() {
      const caja = lienzo!.getBoundingClientRect();
      ancho = caja.width;
      alto = caja.height;
      lienzo!.width = Math.floor(ancho * densidad);
      lienzo!.height = Math.floor(alto * densidad);
      ctx!.setTransform(densidad, 0, 0, densidad, 0, 0);

      // Una brasa cada ~9000 px², con techo en 44. En un monitor ancho no se llena de puntos.
      const cuantas = Math.min(44, Math.round((ancho * alto) / 9000));
      brasas = Array.from({ length: cuantas }, () => nueva(true));
    }

    function nueva(inicial: boolean): Brasa {
      return {
        x: Math.random() * ancho,
        // Al arrancar se reparten por todo el alto; después nacen abajo y suben.
        y: inicial ? Math.random() * alto : alto + Math.random() * 40,
        r: 0.7 + Math.random() * 1.6,
        v: 0.12 + Math.random() * 0.34,
        giro: Math.random() * Math.PI * 2,
        alfa: 0.25 + Math.random() * 0.45,
      };
    }

    function dibujar() {
      ctx!.clearRect(0, 0, ancho, alto);

      for (const b of brasas) {
        b.y -= b.v;
        // Un vaivén lateral muy chico: sin esto suben en línea recta y se lee como lluvia al revés.
        b.giro += 0.008;
        b.x += Math.sin(b.giro) * 0.22;

        if (b.y < -10) Object.assign(b, nueva(false));

        // Se apagan al acercarse al borde de arriba, así que no desaparecen de golpe.
        const desvanecido = Math.min(1, b.y / (alto * 0.85));

        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        // El verde de la paleta. Va literal acá y no por token porque el canvas no lee CSS; si el
        // token cambia, este valor hay que cambiarlo con él.
        ctx!.fillStyle = `rgba(93, 255, 134, ${b.alfa * desvanecido * 0.55})`;
        ctx!.fill();
      }

      if (visible) cuadro = requestAnimationFrame(dibujar);
    }

    function arrancar() {
      if (cuadro) return;
      visible = true;
      cuadro = requestAnimationFrame(dibujar);
    }

    function parar() {
      visible = false;
      if (cuadro) cancelAnimationFrame(cuadro);
      cuadro = 0;
    }

    medir();
    arrancar();

    const alRedimensionar = () => medir();
    // Pestaña oculta: dejar de gastar batería de fondo.
    const alCambiarVisibilidad = () => (document.hidden ? parar() : arrancar());
    // Hero fuera de pantalla: nadie lo está mirando.
    const observador = new IntersectionObserver(
      ([entrada]) => (entrada.isIntersecting ? arrancar() : parar()),
      { threshold: 0 },
    );

    window.addEventListener("resize", alRedimensionar);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    observador.observe(lienzo);

    return () => {
      parar();
      window.removeEventListener("resize", alRedimensionar);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      observador.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

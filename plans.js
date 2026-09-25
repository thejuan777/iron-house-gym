/* Catálogo compartido por la portada y el checkout. Importes de demostración en ARS. */
window.IronHousePlans = Object.freeze({
    dia: {
        name: 'Pase diario', price: 4500, period: 'día',
        frequency: 'Acceso por 1 día, dentro del horario de apertura.',
        description: 'Ideal para entrenamientos ocasionales o para probar el gimnasio.',
        benefits: ['Acceso por 1 día', 'Musculación y cardio', 'Uso de vestuarios y lockers', 'Orientación inicial del equipo']
    },
    '3-veces': {
        name: 'Plan 3 veces por semana', price: 22000, period: 'mes',
        frequency: 'Hasta 3 días por semana durante un mes.',
        description: 'Una frecuencia constante para avanzar hacia tus objetivos.',
        benefits: ['Hasta 3 días por semana', 'Musculación, cardio y clases', 'Rutina adaptada a tu nivel', 'Uso de vestuarios y lockers']
    },
    libre: {
        name: 'Plan libre mensual', price: 30000, period: 'mes',
        frequency: 'Acceso ilimitado durante un mes, en los horarios de apertura.',
        description: 'Entrená a tu ritmo con acceso completo a las instalaciones.',
        benefits: ['Acceso ilimitado durante el mes', 'Acceso completo a las instalaciones', 'Todas las actividades incluidas', 'Seguimiento mensual de tu rutina']
    }
});

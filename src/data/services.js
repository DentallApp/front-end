let services = [
    {
        id: 1,
        name: "Ortodoncia",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://www.orthodonticscity.com/wp-content/uploads/2017/03/tratamiento-de-ortodoncia-en-Guayaquil.jpg"
    },
    {
        id: 2,
        name: "Calces",
        description: 'Se encarga del estudio, prevención, diagnóstico y tratamiento de las anomalías de forma, posición, relación y función de las estructuras dentomaxilofaciales. Es decir, corrige la mal posición dentaria. Una Ortodoncia responsable y bien manejada puede llegar a mejorar el perfil a los pacientes y es necesario antes de colocar un Brackets hacer un análisis o estudio Cefalométrico con radiografías, modelos de yeso, fotografías, etc.',
        img: "https://www.universal.com.do/productos_parati/salud_local/PublishingImages/banner_portal_exclusivodental.jpg"
    },
    {
        id: 3,
        name: "Endodoncia",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://gacetadental.com/wp-content/uploads/2022/05/estudio-ee-uu-supervivencia-dientes-endodoncia.jpg"
    },
    {
        id: 4,
        name: "Implantes",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://www.smartdentistec.com/images/servicios/implantes-dentales.jpg"
    },
    {
        id: 5,
        name: "Diseño de sonrisa",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://clinicadentaldoriamedina.com/wp-content/uploads/2020/03/diseno-de-sonrisa-tratamientos-dentales-02-clinicadentaldoriamedina.jpg"
    },
    {
        id: 6,
        name: "Blanqueamiento",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://www.orthodonticscity.com/wp-content/uploads/2017/03/Blanqueamiento-dental-guayaquil.jpg"
    },
    {
        id: 7,
        name: "Prótesis fijas y removibles",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: 'data:image/jpeg;base64,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'
    },
    {
        id: 8,
        name: "Profilaxis/fluorización",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://ceodint.com/wp-content/uploads/2020/09/profilaxis-long.png"
    },
    {
        id: 9,
        name: "Periodoncia",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://clinicadentalalbertojimenez.com/wp-content/uploads/2021/07/tratamientos-de-periodoncia-marbella.jpeg"
    },
    {
        id: 10,
        name: "Odontopediatría",
        description: 'La limpieza dental, también llamada profilaxis dental, se hace para eliminar la placa ' +
                     'y el cálculo (sarro) que se acumula en los dientes durante el paso del tiempo. ' +
                     'Esta acumulación de placa y sarro se va depositando en los dientes. La placa es una ' +
                     'sustancia viscosa con bacterias y restos de alimentos que se sitúa en los márgenes de la '+
                     'encía y en las zonas más retentivas de los dientes.  El sarro una vez se genera no se puede '+
                     'eliminar con el cepillado.',
        img: "https://escuelaergon.com/wp-content/uploads/shutterstock_663132562.jpg"
    },
];

export default services;
const spanish = {
  messages: {
    greet: "Hola",
    
    chat: {
      initialMessage: "Hola 👋 ¿En qué te puedo ayudar hoy, {name}?",
      title: "Asistente de Tareas",
      placeholder: "Escribe una respuesta...",
      askType:
        "¿Deseas registrar esta sugerencia como una 'tarea' o una 'meta'?",
      askTitle: "¿Cuál será el título de la tarea? (Actual: {current})",
      askDescription: "¿Quieres modificar la descripción? (Actual: {current})",
      askPriority: "¿Qué prioridad deseas asignar? (Ej: 1, 2, 3)",
      askStartDate: "¿Cuál es la fecha de inicio? (Actual: {current})",
      askStartTime: "¿A qué hora comenzará?",
      askEstimatedTime: "¿Cuántos minutos estimas que tomará?",
      askLocation: "¿Dónde se realizará?",
      askRecurrence: "¿Con qué frecuencia se repetirá? (Ej: diaria, semanal)",
      askStatus: "¿Cuál será el estado inicial? (Ej: pendiente, en progreso)",
      completed: "¡Tarea registrada! Puedes guardar o seguir editando.",
    },
    vitalSigns: "Signos Vitales",
    medicalInformation: "Información Médica",
    complementaryData: "Datos Complementarios",
    medicalExamsTitle: "Exámenes Médicos",
    vitalSignsnoData:
      "No ha actualizado los datos de los signos vitales y tratamientos",
    medicalInfonoData: "No se ha definido información médica",
    complementaryDatanoData:
      "No se ha actualizado la información de los datos complementarios",
    medicalExamsnoData: "No se ha realizado exámenes médicos",
    cardMedicamento: "Medicamento Actual",
    cardAlergias: "Alergias",
    cardAntecedentesPersonales: "Antecedentes Personales",
    cardAntecedentesFamiliares: "Antecedentes Familiares",
    cardPlanVacunacion: "Plan de Vacunación",
    cardDiagnostico: "Diagnóstico",
    cardConsultaMedica: "Consulta Médica",
    incomes: "Ingresos",
    expenses: "Gastos",
    menu: {
      desire: {
        title: "Deseos",
        description: "Listas de deseos y compras",
      },
      finance: {
        title: "Finanzas",
        description: "Ingresos, gastos y presupuestos",
      },
      task: {
        title: "Tareas",
        description: "Organiza actividades pendientes",
      },
      personwarehouse: {
        title: "Almacenes",
        description: "Gestiona inventarios",
      },
      product: {
        title: "Productos",
        description: "Catálogo de productos",
      },
      file: {
        title: "Archivos",
        description: "Documentos importantes",
      },
      chat: {
        title: "Chat",
        description: "Comunicación con contactos",
      },
      homes: {
        title: "Hogar",
        description: "Gestión del hogar",
      },
    },
    viewTitles: {
      physicalExams: "Exámenes Físicos",
      tasks: "Tareas",
      treatments: "Tratamientos",
      personalBackground: "Antecedentes Personales",
      familyBackground: "Antecedentes Familiares",
      medicalExams: "Exámenes Médicos",
      diagnosis: "Diagnósticos",
      consultations: "Consultas Médicas",
    },
    settings: {
      category: "Categorías",
      warehouse: "Almacenes",
      priority: "Prioridades",
      role: "Roles",
      status: "Estados",
      hometype: "Tipos de Hogar",
      type: "Tipos de Salud",
    },
    taskForm: {
      dialogTitle: "Detalles de la Tarea",
      fields: {
        title: "Título de la tarea",
        date: "Fecha",
        time: "Hora",
        priority: "Prioridad",
        type: {
          label: "Tipo",
          task: "Tarea",
          event: "Evento",
        },
        status: "Estado",
        category: "Categoría",
        recurrence: "Recurrencia",
        description: "Descripción",
        comments: "Comentarios",
        participants: "Participantes",
        estimatedTime: "Tiempo estimado (hrs)",
        location: "Ubicación",
        endDate: "Fecha de terminación",
        endTime: "Hora de finalización",
      },
      buttons: {
        addDetails: "Agregar detalles",
        hideDetails: "Ocultar detalles",
        cancel: "Cancelar",
        save: "Guardar",
        confirmDelete: "Aceptar",
        close: "Cerrar",
        previous: "Anterior",
        next: "Siguiente",
        saveAndClose: "Guardar y Cerrar",
      },
      validation: {
        required: "Este campo es requerido",
        positiveNumber: "Debe ser un número positivo válido",
      },
      today: "Hoy",
      titles: {
        new: "Agregar Nueva Tarea",
        edit: "Editar Tarea",
      },
    },
    taskTypes: {
      Tarea: "Tarea",
      Evento: "Evento",
    },
    formInstructions: "Introduce los datos solicitados a continuación",
    steps: {
      "Información Básica": {
        title: "Información Básica",
        subtitle: "Ingresa el título y descripción",
      },
      Asignación: {
        title: "Asignación",
        subtitle: "Selecciona responsables y participantes",
      },
      Programación: {
        title: "Programación",
        subtitle: "Elige fecha y hora de la tarea",
      },
    },
    buttons: {
      addDetails: "Agregar detalles",
      hideDetails: "Ocultar detalles",
      cancel: "Cancelar",
      save: "Guardar",
      confirmDelete: "Aceptar",
      close: "Cerrar",
      previous: "Anterior",
      next: "Siguiente",
      saveAndClose: "Guardar y Cerrar",
      seeMore: "Ver más",
    },
    deleteDialog: {
      title: "Eliminar {item}",
      message: "¿Desea eliminar el elemento seleccionado?",
      confirm: "Confirmar eliminación",
      items: {
        task: "tarea",
        physicalExam: "examen físico",
        treatment: "tratamiento",
        personalBackground: "antecedente personal",
        familyBackground: "antecedente familiar",
        medicalExam: "examen médico",
        diagnosis: "diagnóstico",
        medicalConsultation: "consulta médica",
        default: "elemento",
      },
    },
    personDetails: {
      age: {
        withValue: "Edad: {age} años",
        withoutValue: "Edad: No especificada",
      },
      documentType: {
        withValue: "Tipo de identificación: {type}",
        withoutValue: "Sin tipo de identificación",
      },
      documentNumber: {
        withValue: "ID Paciente: {number}",
        withoutValue: "ID no especificado",
      },
    },
    //examenes fisicos
    physicalExam: {
      formInstructions:
        "Complete todos los campos requeridos del examen físico",
      steps: {
        vital_signs: {
          title: "Signos Vitales",
          subtitle: "Datos básicos del paciente",
        },
        body_measurements: {
          title: "Medidas Corporales",
          subtitle: "Peso, altura e IMC",
        },
        observations: {
          title: "Observaciones",
          subtitle: "Examen por sistemas",
        },
      },
      fields: {
        blood_pressure: "Presión Arterial (mmHg)",
        pulse: "Frecuencia Cardíaca (lpm)",
        temperature: "Temperatura (°C)",
        respiratory_rate: "Frecuencia Respiratoria (rpm)",
        exam_date: "Fecha del Examen",
        weight: "Peso (kg)",
        height: "Altura (m)",
        bmi: "Índice de Masa Corporal",
        neurological_observations: "Observaciones Neurológicas",
        cardiovascular_observations: "Observaciones Cardiovasculares",
        respiratory_observations: "Observaciones Respiratorias",
        digestive_observations: "Observaciones Digestivas",
        urinary_observations: "Observaciones Urinarias",
        other_findings: "Otros Hallazgos",
      },
      titles: {
        new: "Nuevo Examen Físico",
        edit: "Editar Examen Físico",
      },
    },
    //tratamiento
    treatment: {
      formInstructions: "Complete todos los campos requeridos del tratamiento",
      steps: {
        medication: {
          title: "Medicación",
          subtitle: "Detalles de la medicación",
        },
        details: {
          title: "Detalles",
          subtitle: "Instrucciones y propósito",
        },
        dates: {
          title: "Fechas",
          subtitle: "Período del tratamiento",
        },
      },
      fields: {
        medication: "Medicamento",
        dosage: "Dosis",
        frequency: "Frecuencia",
        duration: "Duración",
        instructions: "Instrucciones",
        purpose: "Propósito",
        startDate: "Fecha de inicio",
        endDate: "Fecha de fin",
        observations: "Observaciones",
      },
      titles: {
        new: "Nuevo Tratamiento",
        edit: "Editar Tratamiento",
      },
      validationMessages: {
        medication: {
          required: "El medicamento es requerido",
          maxLength: "El medicamento no puede exceder 100 caracteres",
        },
        dosage: {
          maxLength: "La dosis no puede exceder 50 caracteres",
        },
        frequency: {
          maxLength: "La frecuencia no puede exceder 50 caracteres",
        },
        duration: {
          maxLength: "La duración no puede exceder 50 caracteres",
        },
        startDate: {
          invalid: "Fecha de inicio inválida",
        },
        endDate: {
          invalid: "Fecha de fin inválida",
        },
      },
    },
    //antecedentes personales
    personalBackground: {
      formInstructions: "Complete todos los campos de antecedentes personales",
      steps: {
        details: {
          title: "Detalles",
          subtitle: "Información de la condición médica",
        },
        additional: {
          title: "Información Adicional",
          subtitle: "Observaciones clínicas",
        },
        dates: {
          title: "Fechas",
          subtitle: "Cronología de la condición",
        },
      },
      fields: {
        type: "Tipo de condición",
        description: "Condición médica",
        details: "Detalles clínicos",
        startDate: "Fecha de inicio",
        endDate: "Fecha de resolución",
        status: "Estado actual",
        severity: "Nivel de severidad",
      },
      titles: {
        new: "Agregar Antecedente Personal",
        edit: "Editar Antecedente Personal",
        view: "Antecedentes Médicos Personales",
      },
      validationMessages: {
        type: {
          required: "El tipo de condición es requerido",
        },
        description: {
          required: "La descripción médica es obligatoria",
          maxLength: "La descripción no puede exceder 200 caracteres",
        },
      },
      notRecorded: "Sin datos registrados",
      noRecords: "No se encontraron antecedentes personales",
    },
    //antecedentes familiares
    familyBackground: {
      formInstructions: "Complete todos los campos de antecedentes familiares",
      steps: {
        details: {
          title: "Datos Familiares",
          subtitle: "Información del familiar",
        },
        additional: {
          title: "Información Médica",
          subtitle: "Detalles de la condición de salud",
        },
      },
      fields: {
        type: "Tipo de Condición",
        relationship: "Parentesco",
        disease: "Enfermedad/Condición",
        details: "Detalles Médicos",
        date: "Fecha de Registro",
        diagnosis_age: "Edad al Diagnóstico",
      },
      titles: {
        new: "Agregar Antecedente Familiar",
        edit: "Editar Antecedente Familiar",
        view: "Antecedentes Médicos Familiares",
      },
      validationMessages: {
        type: {
          required: "El tipo de condición es requerido",
        },
        relationship: {
          required: "El parentesco es requerido",
        },
        disease: {
          required: "La enfermedad/condición es requerida",
          maxLength:
            "El nombre de la enfermedad no puede exceder 100 caracteres",
        },
        diagnosis_age: {
          invalid: "La edad debe estar entre 0 y 120 años",
        },
      },
      notRecorded: "Sin datos registrados",
      noRecords: "No se encontraron antecedentes familiares",
    },
    medicalExams: {
      formInstructions: "Complete todos los campos del examen médico",
      steps: {
        examDetails: {
          title: "Detalles del Examen",
          subtitle: "Información básica del examen",
        },
        results: {
          title: "Resultados",
          subtitle: "Resultados y observaciones del examen",
        },
      },
      fields: {
        type: "Tipo de Examen",
        exam_name: "Nombre del Examen",
        results: "Resultados",
        observations: "Observaciones",
        date: "Fecha del Examen",
        file: "Archivo Adjunto",
        attach_file: "Adjuntar Archivo",
      },
      actions: {
        viewFile: "Ver Archivo",
        downloadFile: "Descargar",
      },
      titles: {
        new: "Agregar Examen Médico",
        edit: "Editar Examen Médico",
        view: "Exámenes Médicos",
      },
      validationMessages: {
        type: {
          required: "El tipo de examen es obligatorio",
        },
        exam_name: {
          maxLength: "El nombre no puede exceder 200 caracteres",
          invalid: "El nombre es obligatorio",
        },
        date: {
          required: "La fecha del examen es obligatoria",
          invalid: "La fecha debe ser válida",
        },
        file: {
          invalidType:
            "Solo se permiten imágenes (PNG, JPG), PDF y documentos Word",
          sizeExceeded: "El tamaño del archivo debe ser menor a 5MB",
        },
      },
      notRecorded: "Sin datos registrados",
      noRecords: "No se encontraron exámenes médicos",
    },
    diagnoses: {
      formInstructions: "Complete todos los campos del diagnóstico",
      steps: {
        details: {
          title: "Detalles del diagnóstico",
          subtitle: "Información principal del diagnóstico",
        },
        additional: {
          title: "Información adicional",
          subtitle: "Notas y observaciones",
        },
      },
      fields: {
        type: "Tipo de diagnóstico",
        description: "Descripción",
        cie10_code: "Código CIE-10",
        notes: "Notas",
        date: "Fecha del diagnóstico",
      },
      titles: {
        new: "Nuevo diagnóstico",
        edit: "Editar diagnóstico",
        view: "Diagnósticos",
      },
      validationMessages: {
        type: {
          required: "El tipo de diagnóstico es requerido",
        },
        description: {
          required: "La descripción es requerida",
          maxLength: "La descripción no puede exceder los 500 caracteres",
        },
        cie10_code: {
          maxLength: "El código CIE-10 no puede exceder los 20 caracteres",
        },
        date: {
          required: "La fecha es requerida",
        },
      },
      notRecorded: "No registrado",
      noRecords: "No se encontraron diagnósticos",
    },
    consultations: {
      formInstructions: "Complete todos los campos de la consulta médica",
      steps: {
        details: {
          title: "Detalles de la Consulta",
          subtitle: "Información principal de la consulta",
        },
        additional: {
          title: "Información Adicional",
          subtitle: "Notas y observaciones",
        },
      },
      fields: {
        type: "Tipo de Consulta",
        profesional: "Profesional",
        reason: "Motivo de Consulta",
        medicalNotes: "Notas Médicas",
        date: "Fecha de la Consulta",
      },
      validationMessages: {
        type: {
          required: "El tipo de consulta es obligatorio",
        },
        profesional: {
          required: "El profesional es obligatorio",
          maxLength: "No puede exceder 100 caracteres",
        },
        reason: {
          required: "El motivo es obligatorio",
          maxLength: "No puede exceder 500 caracteres",
        },
        date: {
          required: "La fecha es obligatoria",
          invalid: "La fecha no es válida",
        },
      },
    },
    personManagement: {
      formInstructions:
        "Complete todos los campos requeridos para registrar la información de la persona",
      edit_title: "Editar Persona",
      create_title: "Nueva Persona",
      no_changes: "No se realizaron cambios",
      save_error: "Error al guardar la información",
      steps: {
        basic_info: {
          title: "Información Básica",
          subtitle: "Datos principales de la persona",
        },
        personal_info: {
          title: "Información Personal",
          subtitle: "Detalles personales y contacto",
        },
        medical_info: {
          title: "Información Médica",
          subtitle: "Datos médicos y documentación",
        },
      },
      fields: {
        profile_image: "Imagen de perfil",
        name: "Nombre completo",
        username: "Nombre de usuario",
        password: "Contraseña",
        language: "Idioma",
        birth_date: "Fecha de nacimiento",
        age: "Edad",
        gender: "Género",
        emergency_contact: "Contacto de emergencia",
        email: "Correo electrónico",
        phone: "Teléfono",
        address: "Dirección",
        medical_record_number: "Número de historial médico",
        document_type: "Tipo de documento",
        document_number: "Número de documento",
        health_coverage: "Cobertura de salud",
        coverage_name: "Nombre de la cobertura",
        blood_type: "Tipo de sangre",
      },
      genders: {
        male: "Masculino",
        female: "Femenino",
        other: "Otro",
      },
      documentTypes: {
        id: "Cédula",
        passport: "Pasaporte",
        driver_license: "Licencia de conducir",
      },
      healthCoverages: {
        public: "Pública",
        private: "Privada",
        none: "Ninguna",
      },
      validation: {
        name_required: "El nombre es requerido",
        email_valid: "El correo electrónico debe ser válido",
        image_size: "La imagen debe ser menor a 500KB",
      },
    },
    finances: {
      formInstructions: {
        income: "Complete todos los campos del registro de ingresos",
        expense: "Complete todos los campos del registro de gastos",
        finance: "Complete todos los campos del registro financiero", // General por si acaso
      },
      steps: {
        financialDetails: {
          title: "Detalles Financieros",
          subtitle: "Información básica del registro",
        },
        description: {
          title: "Descripción",
          subtitle: "Detalles adicionales",
        },
      },
      fields: {
        type: "Tipo de Transacción",
        method: "Método de Pago",
        income: "Ingreso",
        spent: "Gasto",
        description: "Descripción",
        date: "Fecha",
        file: "Comprobante",
        attach_file: "Adjuntar Comprobante",
      },
      actions: {
        viewFile: "Ver Comprobante",
        downloadFile: "Descargar",
      },
      titles: {
        new: {
          income: "Agregar Ingreso",
          expense: "Agregar Gasto",
          finance: "Agregar Registro Financiero",
        },
        edit: {
          income: "Editar Ingreso",
          expense: "Editar Gasto",
          finance: "Editar Registro Financiero",
        },
        view: {
          income: "Registros de Ingresos",
          expense: "Registros de Gastos",
          finance: "Registros Financieros",
        },
      },
      validationMessages: {
        type: {
          required: "El tipo es requerido",
          maxLength: "El tipo no puede exceder 50 caracteres",
        },
        method: {
          maxLength: "El método no puede exceder 50 caracteres",
        },
        income: {
          number: "El ingreso debe ser un número",
          precision: "El ingreso debe tener máximo 2 decimales",
        },
        spent: {
          number: "El gasto debe ser un número",
          precision: "El gasto debe tener máximo 2 decimales",
        },
        description: {
          maxLength: "La descripción no puede exceder 255 caracteres",
        },
        date: {
          required: "La fecha es obligatoria",
          invalid: "La fecha debe ser válida",
        },
        file: {
          invalidType: "Solo se permiten imágenes (PNG, JPG)",
          sizeExceeded: "El tamaño del archivo debe ser menor a 500KB",
        },
      },
      notRecorded: "Sin registro",
      noRecords: "No se encontraron registros financieros",
      header: {
        title: "Finanzas del Hogar",
        subtitle: "Control familiar de ingresos y gastos",
      },
      suggestions: {
        title: "Sugerencias Inteligentes",
        alerts: {
          message: "Tienes {count} alerta para hoy",
          message_plural: "Tienes {count} alertas para hoy",
        },
      },
      comparison: {
        lastMonth: "Mes pasado",
        thisMonth: "Este mes",
        vs: "vs {amount}",
      },
      sections: {
        balance: "Balance",
        movements: "Movimientos",
        suggestions: "Sugerencias",
      },
      currentAmount: "<strong>{amount}</strong> actual",
    },
    summary: {
      title: "Resumen de",
    },
  },
};

export default spanish;

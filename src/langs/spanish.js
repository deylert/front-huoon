const spanish = {
  messages: {
    greet: "Hola",
    chat: {
      initialMessage: "Hola 👋 ¿En qué te puedo ayudar hoy, {name}?",
    },
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
    },settings: {
    category: "Categorías",
    warehouse: "Almacenes",
    priority: "Prioridades",
    role: "Roles",
    status: "Estados",
    hometype: "Tipos de Hogar",
    type: "Tipos de Salud"
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
          event: "Evento"
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
        endTime: "Hora de finalización"
      },
      buttons: {
        addDetails: "Agregar detalles",
        hideDetails: "Ocultar detalles",
        cancel: "Cancelar",
        save: "Guardar",
        confirmDelete: "Aceptar",
        "close": "Cerrar",
        "previous": "Anterior",
        "next": "Siguiente",
        "saveAndClose": "Guardar y Cerrar"
      },
      validation: {
        required: "Este campo es requerido",
        positiveNumber: "Debe ser un número positivo válido"
      },
      today: "Hoy",
      titles: {
      "new": "Agregar Nueva Tarea",
      "edit": "Editar Tarea"
    }
    },
     taskTypes: {
    "Tarea": "Tarea",
    "Evento": "Evento"
  },
  formInstructions: "Introduce los datos solicitados a continuación",
    "steps": {
      "Información Básica": {
        "title": "Información Básica",
        "subtitle": "Ingresa el título y descripción"
      },
      "Asignación": {
        "title": "Asignación",
        "subtitle": "Selecciona responsables y participantes"
      },
      "Programación": {
        "title": "Programación",
        "subtitle": "Elige fecha y hora de la tarea"
      }
    },
    buttons: {
        addDetails: "Agregar detalles",
        hideDetails: "Ocultar detalles",
        cancel: "Cancelar",
        save: "Guardar",
        confirmDelete: "Aceptar",
        "close": "Cerrar",
        "previous": "Anterior",
        "next": "Siguiente",
        "saveAndClose": "Guardar y Cerrar"
      },
      "deleteDialog": {
    "title": "Eliminar {item}",
    "message": "¿Desea eliminar este(a) {item}?",
    "confirm": "Confirmar eliminación",
    "items": {
      "task": "tarea",
      "user": "usuario",
      "event": "evento",
      "default": "elemento"
    }
  }
  },
  
};

export default spanish;

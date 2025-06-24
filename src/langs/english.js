const english = {
  messages: {
    greet: "Hello', {user}",
    chat: {
      initialMessage: "Hi 👋 How can I help you today, {name}?",
      // Puedes agregar más mensajes del bot aquí
    },
    menu: {
      desire: {
        title: "Wishes",
        description: "Wish and shopping lists",
      },
      finance: {
        title: "Finances",
        description: "Income, expenses, budgets",
      },
      task: {
        title: "Tasks",
        description: "Organize pending activities",
      },
      personwarehouse: {
        title: "Warehouses",
        description: "Manage inventories",
      },
      product: {
        title: "Products",
        description: "Product catalog",
      },
      file: {
        title: "Files",
        description: "Important documents",
      },
      chat: {
        title: "Chat",
        description: "Contact communication",
      },
      homes: {
        title: "Home",
        description: "Household management",
      },
    },
    settings: {
    category: "Categories",
    warehouse: "Warehouses",
    priority: "Priorities",
    role: "Roles",
    status: "Statuses",
    hometype: "Home Types",
    type: "Health Types"
  },
   taskForm: {
      dialogTitle: "Task Details",
      fields: {
        title: "Task title",
        date: "Date",
        time: "Time",
        priority: "Priority",
        type: {
          label: "Type",
          task: "Task",
          event: "Event"
        },
        status: "Status",
        category: "Category",
        recurrence: "Recurrence",
        description: "Description",
        comments: "Comments",
        participants: "Participants",
        estimatedTime: "Estimated time (hrs)",
        location: "Location",
        endDate: "End date",
        endTime: "End time"
      },
      buttons: {
        addDetails: "Add details",
        hideDetails: "Hide details",
        cancel: "Cancel",
        save: "Save",
        confirmDelete: "Accept",
         "close": "Close",
      "previous": "Previous",
      "next": "Next",
      "saveAndClose": "Save and Close"
      },
      validation: {
        required: "This field is required",
        positiveNumber: "Must be a valid positive number"
      },
      today: "Today",
      titles: {
      "new": "Add New Task",
      "edit": "Edit Task"
    }
    },
    taskTypes: {
    "Tarea": "Task",
    "Evento": "Event"
  },
  formInstructions: "Enter the requested information below",
    "steps": {
      "Información Básica": {
        "title": "Basic Information",
        "subtitle": "Enter title and description"
      },
      "Asignación": {
        "title": "Assignment",
        "subtitle": "Select responsible parties"
      },
      "Programación": {
        "title": "Scheduling",
        "subtitle": "Choose date and time"
      }
    },
    buttons: {
        addDetails: "Add details",
        hideDetails: "Hide details",
        cancel: "Cancel",
        save: "Save",
        confirmDelete: "Accept",
         "close": "Close",
      "previous": "Previous",
      "next": "Next",
      "saveAndClose": "Save and Close"
      },
      "deleteDialog": {
    "title": "Delete {item}",
    "message": "Do you want to delete this {item}?",
    "confirm": "Confirm deletion",
    "items": {
      "task": "task",
      "user": "user",
      "event": "event",
      "default": "item"
    }
  }
  },
};

export default english;

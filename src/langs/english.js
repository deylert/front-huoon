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
        title: "Title",
        date: "Date",
        time: "Time",
        priority: "Priority",
        type: {
          label: "Type",
          task: "Task",
          event: "Event"
        },
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
        save: "Save"
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
  },
};

export default english;

const english = {
  messages: {
    greet: "Hello', {user}",
    chat: {
      initialMessage: "Hello 👋 How can I help you today, {name}?",
      title: "Task Assistant",
      placeholder: "Type a response...",
      askType:
        "Do you want to register this suggestion as a 'task' or a 'goal'?",
      askTitle: "What will be the title? (Current: {current})",
      askDescription:
        "Do you want to modify the description? (Current: {current})",
      askPriority: "What priority do you want to assign? (e.g.: 1, 2, 3)",
      askStartDate: "What is the start date? (Current: {current})",
      askStartTime: "What time will it start? (HH:mm)",
      askEstimatedTime:
        "How many minutes do you estimate it will take? (e.g.: 1h, 30min)",
      askLocation: "Where will it take place?",
      askRecurrence: "How often will it repeat? (e.g.: daily, weekly)",
      askStatus:
        "What will be the initial status? (e.g.: pending, in progress)",
      completed: "✅ All ready! Saving...",
      invalidSuggestion: "⚠️ No valid suggestion received.",
      suggestionMessage:
        "💡 You have a new suggestion:\n\n📌 {title}\n📝 {description}\n📅 {date}",
      notAvailable: "Not available",
      createAsTask: "Create as task",
      createAsGoal: "Create as goal",
      taskTitle: "Task title",
      taskDescription: "Task description",
      dateSelected: "Selected date: {date}",
      mustSelectParticipants: "⚠️ You must select at least one participant",
      confirmedParticipants:
        "Confirmed {count} participant | Confirmed {count} participants",
      willModifyParticipants: "I'll modify the participant selection",
      selectedParticipants:
        "{count} participant selected | {count} participants selected",
      inputPlaceholder: "Type a message or dictate...",
    },
    general: {
      yes: "Yes",
      no: "No",
    },
    no_definido: "Not defined",
    vitalSigns: "Vital Signs",
    medicalInformation: "Medical Information",
    complementaryData: "Complementary Data",
    medicalExamsTitle: "Medical Exams",
    vitalSignsnoData: "You haven't updated vital signs and treatments data",
    medicalInfonoData: "No medical information has been defined",
    complementaryDatanoData:
      "Complementary data information has not been updated",
    medicalExamsnoData: "No medical exams have been performed",
    cardMedicamento: "Current Medication",
    cardAlergias: "Allergies",
    cardAntecedentesPersonales: "Personal History",
    cardAntecedentesFamiliares: "Family History",
    cardPlanVacunacion: "Vaccination Plan",
    cardDiagnostico: "Diagnosis",
    cardConsultaMedica: "Medical Consultation",
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
      suggestions: {
        title: "Suggestions",
        description: "Recommendations and proposals",
      },
    },
    viewTitles: {
      physicalExams: "Physical Exams",
      tasks: "Tasks",
      treatments: "Treatments",
      personalBackground: "Personal Background",
      familyBackground: "Family Background",
      medicalExams: "Medical Exams",
      diagnosis: "Diagnoses",
      medicalConsultations: "Medical Consultations",
      incomes: "Income",
      expenses: "Expenses",
      budget: "Budgets",
      suggestions: "Suggestions",
    },
    settings: {
      category: "Categories",
      warehouse: "Warehouses",
      priority: "Priorities",
      role: "Roles",
      status: "Statuses",
      hometype: "Home Types",
      type: "Health Types",
      history: "Medical History",
    },
    taskForm: {
      noTasksToday: "You have no tasks to do today",
      updateStatus: "Update Status",
      dialogTitle: "Task Details",
      fields: {
        title: "Task title",
        date: "Date",
        time: "Time",
        priority: "Priority",
        type: {
          label: "Type",
          task: "Task",
          event: "Event",
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
        endTime: "End time",
      },
      buttons: {
        addDetails: "Add details",
        hideDetails: "Hide details",
        cancel: "Cancel",
        save: "Save",
        confirmDelete: "Accept",
        close: "Close",
        previous: "Previous",
        next: "Next",
        saveAndClose: "Save and Close",
      },
      validation: {
        required: "This field is required",
        positiveNumber: "Must be a valid positive number",
      },
      today: "Today",
      titles: {
        new: "Add New Task",
        edit: "Edit Task",
      },
    },
    taskTypes: {
      Tarea: "Task",
      Evento: "Event",
    },
    formInstructions: "Enter the requested information below",
    steps: {
      "Información Básica": {
        title: "Basic Information",
        subtitle: "Enter title and description",
      },
      Asignación: {
        title: "Assignment",
        subtitle: "Select responsible parties",
      },
      Programación: {
        title: "Scheduling",
        subtitle: "Choose date and time",
      },
    },
    buttons: {
      addDetails: "Add details",
      hideDetails: "Hide details",
      cancel: "Cancel",
      save: "Save",
      confirmDelete: "Accept",
      close: "Close",
      previous: "Previous",
      next: "Next",
      saveAndClose: "Save and Close",
      seeMore: "See more",
    },
    deleteDialog: {
      title: "Delete {item}",
      message: "¿Do you want to delete the selected item?",
      confirm: "Confirm deletion",
      items: {
        file: "file",
        product: "product",
        warehouse: "warehouse",
        wish: "wish",
        task: "task",
        physicalExam: "physical exam",
        treatment: "treatment",
        personalBackground: "personal background",
        familyBackground: "family background",
        medicalExam: "medical exam",
        diagnosis: "diagnosis",
        medicalConsultation: "medical consultation",
        default: "item",
      },
    },
    personDetails: {
      age: {
        withValue: "Age: {age} years",
        withoutValue: "Age: Not specified",
      },
      documentType: {
        withValue: "ID Type: {type}",
        withoutValue: "No ID type",
      },
      documentNumber: {
        withValue: "Patient ID: {number}",
        withoutValue: "ID not specified",
      },
    },

    //examenes fisicos
    physicalExam: {
      formInstructions: "Complete all required fields of the physical exam",
      steps: {
        vital_signs: {
          title: "Vital Signs",
          subtitle: "Basic patient data",
        },
        body_measurements: {
          title: "Body Measurements",
          subtitle: "Weight, height and BMI",
        },
        observations: {
          title: "Observations",
          subtitle: "System examination",
        },
      },
      fields: {
        blood_pressure: "Blood Pressure (mmHg)",
        pulse: "Heart Rate (bpm)",
        temperature: "Temperature (°C)",
        respiratory_rate: "Respiratory Rate (rpm)",
        exam_date: "Exam Date",
        weight: "Weight (kg)",
        height: "Height (m)",
        bmi: "Body Mass Index",
        neurological_observations: "Neurological Observations",
        cardiovascular_observations: "Cardiovascular Observations",
        respiratory_observations: "Respiratory Observations",
        digestive_observations: "Digestive Observations",
        urinary_observations: "Urinary Observations",
        other_findings: "Other Findings",
      },
      titles: {
        new: "New Physical Exam",
        edit: "Edit Physical Exam",
      },
    },
    //tratamiento
    treatment: {
      formInstructions: "Complete all required fields of the treatment",
      cardMedicamento: "Medication",
      cardMedicamentosPlural: "Medications ({count})",
      medicamentosActivos: "{count} active medications",
      no_definido: "Not defined",
      noTreatments: "No treatments defined yet",
      steps: {
        medication: {
          title: "Medication",
          subtitle: "Medication details",
        },
        details: {
          title: "Details",
          subtitle: "Instructions and purpose",
        },
        dates: {
          title: "Dates",
          subtitle: "Treatment period",
        },
      },
      fields: {
        medication: "Medication",
        dosage: "Dosage",
        frequency: "Frequency",
        duration: "Duration (ex: 5 days, 2 weeks)",
        durationHint:
          "Specify duration with number and unit (days, weeks, months)",
        instructions: "Instructions",
        purpose: "Purpose",
        startDate: "Start Date",
        endDate: "End Date",
        observations: "Observations",
      },
      titles: {
        new: "New Treatment",
        edit: "Edit Treatment",
      },
      validationMessages: {
        medication: {
          required: "Medication is required",
          maxLength: "Medication cannot exceed 100 characters",
        },
        dosage: {
          maxLength: "Dosage cannot exceed 50 characters",
        },
        frequency: {
          maxLength: "Frequency cannot exceed 50 characters",
        },
        duration: {
          maxLength: "Duration cannot exceed 50 characters",
        },
        startDate: {
          invalid: "Invalid start date",
        },
        endDate: {
          invalid: "Invalid end date",
        },
      },
    },
    //antecedentes personales
    personalBackground: {
      formInstructions: "Complete all personal medical history fields",
      steps: {
        details: {
          title: "Details",
          subtitle: "Medical condition information",
        },
        additional: {
          title: "Additional Info",
          subtitle: "Clinical observations",
        },
        dates: {
          title: "Dates",
          subtitle: "Timeline of condition",
        },
      },
      fields: {
        type: "Condition Type",
        description: "Medical Condition",
        details: "Clinical Details",
        startDate: "Onset Date",
        endDate: "Resolution Date",
        status: "Current Status",
        severity: "Severity Level",
      },
      titles: {
        new: "Add New Personal History",
        edit: "Edit Personal History",
        view: "Personal Medical History",
      },
      validationMessages: {
        type: {
          required: "Condition type is required",
        },
        description: {
          required: "Medical condition description is required",
          maxLength: "Description cannot exceed 200 characters",
        },
      },
      notRecorded: "No data recorded",
      noRecords: "No personal medical history found",
    },
    //antecedentes familiares
    familyBackground: {
      formInstructions: "Complete all family medical history fields",
      steps: {
        details: {
          title: "Family Details",
          subtitle: "Family member information",
        },
        additional: {
          title: "Medical Info",
          subtitle: "Health condition details",
        },
      },
      fields: {
        type: "Condition Type",
        relationship: "Relationship",
        disease: "Disease/Condition",
        details: "Medical Details",
        date: "Date Recorded",
        diagnosis_age: "Age at Diagnosis",
      },
      titles: {
        new: "Add New Family History",
        edit: "Edit Family History",
        view: "Family Medical History",
      },
      validationMessages: {
        type: {
          required: "Condition type is required",
        },
        relationship: {
          required: "Family relationship is required",
        },
        disease: {
          required: "Disease/condition is required",
          maxLength: "Disease name cannot exceed 100 characters",
        },
        diagnosis_age: {
          invalid: "Age must be between 0 and 120 years",
        },
      },
      notRecorded: "No data recorded",
      noRecords: "No family medical history found",
    },
    medicalExams: {
      formInstructions: "Fill in all medical exam fields",
      steps: {
        examDetails: {
          title: "Exam Details",
          subtitle: "Basic exam information",
        },
        results: {
          title: "Results",
          subtitle: "Exam results and observations",
        },
      },
      fields: {
        type: "Exam Type",
        exam_name: "Exam Name",
        results: "Results",
        observations: "Observations",
        date: "Exam Date",
        file: "File",
        attach_file: "Attach File",
      },
      actions: {
        viewFile: "View File",
        downloadFile: "Download",
      },
      titles: {
        new: "Add Medical Exam",
        edit: "Edit Medical Exam",
        view: "Medical Exams",
      },
      validationMessages: {
        type: {
          required: "Exam type is required",
        },
        exam_name: {
          maxLength: "Name cannot exceed 200 characters",
          required: "Exam name is required",
        },
        date: {
          required: "Exam date is required",
          invalid: "Date must be valid",
        },
        file: {
          invalidType:
            "Only images (PNG, JPG), PDF and Word documents are allowed",
          sizeExceeded: "File size must be less than 5MB",
        },
      },
      notRecorded: "No data recorded",
      noRecords: "No medical exams found",
    },
    diagnoses: {
      formInstructions: "Fill in all diagnosis fields",
      steps: {
        details: {
          title: "Diagnosis Details",
          subtitle: "Main diagnosis information",
        },
        additional: {
          title: "Additional Info",
          subtitle: "Notes and observations",
        },
      },
      fields: {
        type: "Diagnosis Type",
        description: "Description",
        cie10_code: "CIE-10 Code",
        notes: "Notes",
        date: "Diagnosis Date",
      },
      titles: {
        new: "New Diagnosis",
        edit: "Edit Diagnosis",
        view: "Diagnoses",
      },
      validationMessages: {
        type: {
          required: "Diagnosis type is required",
        },
        description: {
          required: "Description is required",
          maxLength: "Description cannot exceed 500 characters",
        },
        cie10_code: {
          maxLength: "CIE-10 code cannot exceed 20 characters",
        },
        date: {
          required: "Date is required",
        },
      },
      notRecorded: "Not recorded",
      noRecords: "No diagnoses found",
    },
    consultations: {
      formInstructions: "Fill in all medical consultation fields",
      steps: {
        details: {
          title: "Consultation Details",
          subtitle: "Main consultation information",
        },
        additional: {
          title: "Additional Info",
          subtitle: "Notes and observations",
        },
      },
      fields: {
        type: "Consultation Type",
        profesional: "Professional",
        reason: "Consultation Reason",
        medicalNotes: "Medical Notes",
        date: "Consultation Date",
      },
      validationMessages: {
        type: {
          required: "Consultation type is required",
        },
        profesional: {
          required: "Professional is required",
          maxLength: "Cannot exceed 100 characters",
        },
        reason: {
          required: "Reason is required",
          maxLength: "Cannot exceed 500 characters",
        },
        date: {
          required: "Date is required",
          invalid: "Date is not valid",
        },
      },
    },
    personManagement: {
      formInstructions:
        "Fill in all required fields to register the person's information",
      edit_title: "Edit Person",
      create_title: "New Person",
      no_changes: "No changes were made",
      save_error: "Error saving information",
      steps: {
        basic_info: {
          title: "Basic Information",
          subtitle: "Person's main data",
        },
        personal_info: {
          title: "Personal Information",
          subtitle: "Personal details and contact",
        },
        medical_info: {
          title: "Medical Information",
          subtitle: "Medical data and documentation",
        },
      },
      fields: {
        profile_image: "Profile image",
        name: "Full name",
        username: "Username",
        password: "Password",
        language: "Language",
        birth_date: "Birth date",
        age: "Age",
        gender: "Gender",
        emergency_contact: "Emergency contact",
        email: "Email",
        phone: "Phone",
        address: "Address",
        medical_record_number: "Medical record number",
        document_type: "Document type",
        document_number: "Document number",
        health_coverage: "Health coverage",
        coverage_name: "Coverage name",
        blood_type: "Blood type",
      },
      genders: {
        male: "Male",
        female: "Female",
        other: "Other",
      },
      documentTypes: {
        id: "ID",
        passport: "Passport",
        driver_license: "Driver license",
      },
      healthCoverages: {
        public: "Public",
        private: "Private",
        none: "None",
      },
      validation: {
        name_required: "Name is required",
        email_valid: "Email must be valid",
        image_size: "Image must be smaller than 500KB",
      },
    },
    finances: {
      formInstructions: {
        income: "Complete all fields in the income record",
        expense: "Complete all fields in the expense record",
        finance: "Complete all fields in the financial record",
      },
      steps: {
        financialDetails: {
          title: "Financial Details",
          subtitle: "Basic information of the record",
        },
        description: {
          title: "Description",
          subtitle: "Additional details",
        },
      },
      fields: {
        type: "Transaction Type",
        method: "Payment Method",
        income: "Income",
        spent: "Expense",
        description: "Description",
        date: "Date",
        file: "Receipt",
        attach_file: "Attach Receipt",
      },
      actions: {
        viewFile: "View Receipt",
        downloadFile: "Download",
      },
      titles: {
        new: {
          income: "Add Income",
          expense: "Add Expense",
          finance: "Add Financial Record",
        },
        edit: {
          income: "Edit Income",
          expense: "Edit Expense",
          finance: "Edit Financial Record",
        },
        view: {
          income: "Income Records",
          expense: "Expense Records",
          finance: "Financial Records",
        },
      },
      validationMessages: {
        type: {
          required: "Type is required",
          maxLength: "Type cannot exceed 50 characters",
        },
        method: {
          maxLength: "Method cannot exceed 50 characters",
        },
        income: {
          number: "Income must be a number",
          precision: "Income must have up to 2 decimal places",
        },
        spent: {
          number: "Expense must be a number",
          precision: "Expense must have up to 2 decimal places",
        },
        description: {
          maxLength: "Description cannot exceed 255 characters",
        },
        date: {
          required: "Date is required",
          invalid: "Date must be valid",
        },
        file: {
          invalidType: "Only images (PNG, JPG) are allowed",
          sizeExceeded: "File size must be less than 500KB",
        },
      },
      notRecorded: "Not recorded",
      noRecords: "No financial records found",
      header: {
        title: "Household Finances",
        subtitle: "Family income and expense control",
      },
      suggestions: {
        title: "Smart Suggestions",
        alerts: {
          message: "You have {count} alert for today",
          message_plural: "You have {count} alerts for today",
        },
      },
      comparison: {
        lastMonth: "Last month",
        thisMonth: "This month",
        vs: "vs {amount}",
      },
      sections: {
        balance: "Balance",
        movements: "Movements",
        suggestions: "Suggestions",
        budget: "Budget",
      },
      currentAmount: "<strong>{amount}</strong> current",
    },
    summary: {
      title: "Summary for",
    },
    budget: {
      formInstructions: "Complete all budget fields",
      steps: {
        basic: {
          title: "Basic Information",
          subtitle: "Budget main data",
        },
        dates: {
          title: "Dates & Details",
          subtitle: "Period and description",
        },
      },
      fields: {
        category: "Category",
        budget_type: "Budget Type",
        amount: "Amount",
        used_amount: "Used Amount",
        start_date: "Start Date",
        end_date: "End Date",
        description: "Description",
        status: "Status",
        currency: "Currency",
        available: "Available",
        total: "Total",
      },
      currencies: {
        USD: "US Dollar",
        EUR: "Euro",
        BRL: "Brazilian Real",
        MXN: "Mexican Peso",
        COP: "Colombian Peso",
      },
      status: {
        active: "Active",
        inactive: "Inactive",
        completed: "Completed",
        exceeded: "Exceeded",
      },
      titles: {
        new: "Add New Budget",
        edit: "Edit Budget",
        view: "Budgets",
      },
      validationMessages: {
        category: {
          required: "Category is required",
        },
        amount: {
          required: "Amount is required",
          invalid: "Amount must be greater than 0",
        },
        used_amount: {
          invalid: "Used amount cannot exceed total amount",
        },
        start_date: {
          invalid: "Start date must be before end date",
        },
      },
      notRecorded: "No data recorded",
      noRecords: "No budgets found",
    },
    suggestedTasks: {
      dialog: {
        title: "Suggested tasks",
        subtitle: "Select the tasks you want to add",
        closeButton: "Close",
        createButton: "Create selected tasks",
        noTasks: "No suggested tasks available",
        unassigned: "Unassigned",
      },
      fields: {
        date: "Date",
        time: "Time",
        duration: "Duration",
        title: "Title",
        description: "Description",
        location: "Location",
        score: "Score",
      },
      selection: {
        count: "({{count}} selected)",
      },
      steps: {
        selection: {
          title: "Task selection",
          subtitle: "Choose relevant tasks",
        },
      },
      scoreTooltip: "Points for completing this task",
      scoreValues: {
        low: "Low (1-3 pts)",
        medium: "Medium (4-7 pts)",
        high: "High (8-10 pts)",
      },
    },
    warehouse: {
      formTitle: {
        create: "Create new warehouse",
        edit: "Edit warehouse",
      },
      formInstructions: "Complete the required information for the warehouse",
      steps: {
        basic: {
          title: "Basic Information",
          subtitle: "Main details",
        },
        configuration: {
          title: "Additional Configuration",
          subtitle: "Status and description",
        },
      },
      fields: {
        warehouse: "Warehouses",
        name: "Name",
        home_location: "Home location",
        status: "Status",
        description: "Description",
      },
      status: {
        public: "Public",
        private: "Private",
      },
      validation: {
        required: "{field} is required",
        min_length: "{field} must be at least {length} characters",
        max_length: "{field} must be less than {length} characters",
        invalid_selection: "Please select a valid {field}",
      },
      list: {
        title: "Warehouses List",
        empty: "No warehouses registered",
        search: "Search warehouses...",
        columns: {
          name: "Name",
          location: "Location",
          status: "Status",
          actions: "Actions",
        },
      },
    },
    product: {
      listing: {
        title: "Products by Warehouses List",
        addButton: "Add Product",
        description: "Description",
        quantity: "Quantity",
        delete: "Delete",
        edit: "Edit",
        noProducts: "No products in this warehouse",
      },
      formTitle: {
        create: "Create new product",
        edit: "Edit product",
      },
      formInstructions: "Complete the required product information",
      steps: {
        basic: {
          title: "Basic Information",
          subtitle: "Product main details",
        },
        purchase: {
          title: "Purchase Information",
          subtitle: "Acquisition details",
        },
        additional: {
          title: "Additional Configuration",
          subtitle: "Complementary options",
        },
      },
      fields: {
        name: "Name",
        brand: "Brand",
        image: "Product image",
        additional_notes: "Additional notes",
        unit_price: "Unit price",
        quantity: "Quantity",
        total_price: "Total price",
        status: "Status",
        category: "Category",
        purchase_date: "Purchase date",
        expiration_date: "Expiration date",
        frequency: "Frequency (hours)",
        type: "Type",
        purchase_place: "Purchase place",
      },
      types: {
        winter: "Winter",
        summer: "Summer",
      },
      validation: {
        required: "{field} is required",
        min_length: "{field} must be at least {length} characters",
        invalid_number: "{field} must be a valid number",
        min_value: "{field} must be greater than or equal to {value}",
        no_data: "No data available",
      },
    },
    files: {
      listing: {
        title: "File Management",
        addButton: "Add File",
        search: "Search",
        noData: "No data available",
        loading: "Loading data...",
        itemsPerPage: "Items per page",
        actions: {
          view: "View file",
          edit: "Edit",
          delete: "Delete",
        },
        types: {
          personal: "Personal",
          home: "Home",
          all: "All",
        },
      },
      formTitle: {
        create: "Create new file",
        edit: "Edit file",
      },
      formInstructions: "Complete the required information for the file",
      steps: {
        basic: {
          title: "Basic information",
          subtitle: "Main file details",
        },
        file_config: {
          title: "File and type",
          subtitle: "Document settings",
        },
      },
      fields: {
        name: "Name",
        date: "Date",
        type: "Type",
        description: "Description",
        file: "File",
        preview: "Preview",
        actions: "Actions",
      },
      types: {
        personal: "Personal",
        home: "Home",
      },
      validation: {
        required: "{field} is required",
        invalidFile: "Invalid file format",
      },
    },
    wishes: {
      steps: {
        basic: {
          title: "Basic information",
          subtitle: "Main wish details",
        },
        details: {
          title: "Dates and priority",
          subtitle: "Fulfillment settings",
        },
        additional: {
          title: "Additional information",
          subtitle: "Location and description",
        },
      },
      listing: {
        title: "Wishes Management",
        addButton: "Add Wish",
        search: "Search",
        noData: "No wishes available",
        loading: "Loading wishes...",
        itemsPerPage: "Wishes per page",
        actions: {
          edit: "Edit",
          delete: "Delete",
        },
        types: {
          personal: "Personal",
          home: "Home",
          professional: "Professional",
          all: "All",
        },
      },
      formTitle: {
        create: "Create new wish",
        edit: "Edit wish",
      },
      formInstructions: "Complete the wish information",
      fields: {
        name: "Name",
        type: "Type",
        date: "Date",
        fulfillment_date: "Fulfillment date",
        priority: "Priority",
        status: "Status",
        location: "Location",
        description: "Description",
        actions: "Actions",
      },
      priorities: {
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent",
      },
      statuses: {
        pending: "Pending",
        in_progress: "In progress",
        completed: "Completed",
        cancelled: "Cancelled",
      },
      validation: {
        required: "{field} is required",
        invalid_date: "Invalid date",
      },
    },
    suggestions: {
      formInstructions: {
        suggestion: "Complete all suggestion fields",
      },
      steps: {
        suggestionDetails: {
          title: "Suggestion Details",
          subtitle: "Basic registration information",
        },
        content: {
          title: "Content",
          subtitle: "Additional details",
        },
      },
      fields: {
        title: "Title",
        description: "Description",
        content: "Content",
        date: "Date",
        status: "Status",
        type: "Type",
      },
      statuses: {
        Pendiente: "Pending",
        Revisado: "Reviewed",
        Completado: "Completed",
        rejected: "Rejected",
      },
      types: {
        // Types of suggestions you define
      },
      titles: {
        new: "New Suggestion",
        edit: "Edit Suggestion",
        view: "Suggestion Records",
      },
      validationMessages: {
        title: {
          maxLength: "Title must not exceed 255 characters",
        },
        description: {
          maxLength: "Description cannot exceed 500 characters",
        },
        content: {
          maxLength: "Content cannot exceed 1000 characters",
        },
        date: {
          required: "Date is required",
          invalid: "Date must be valid",
        },
        status: {
          invalid:
            "Status must be one of: pending, reviewed, approved, rejected",
        },
      },
      noRecords: "No suggestions found",
      header: {
        title: "Home Suggestions",
        subtitle: "Family recommendations and proposals",
      },
    },
    home: {
      create: {
        title: "Create a new home",
        instructions: "Please fill in all required fields to create your home",
        steps: {
          basic: {
            title: "Basic Information",
            subtitle: "Main home details",
          },
          details: {
            title: "Additional Details",
            subtitle: "Home configurations",
          },
          members: {
            title: "Home Members",
            subtitle: "Add people to your home",
          },
        },
        fields: {
          name: "Home name",
          address: "Address",
          type: "Home type",
          code: "Access code",
          geoLocation: "Geolocation",
          timezone: "Timezone",
          residents: "Number of residents",
          image: "Home image",
          status: "Status",
        },
        membersTable: {
          avatar: "Avatar",
          name: "Name",
          email: "Email",
          role: "Role",
          actions: "Actions",
        },
        actions: {
          cancel: "Cancel",
          previous: "Previous",
          next: "Next",
          create: "Create Home",
          addMembers: "Add Members",
        },
        validation: {
          nameRequired: "Home name is required",
          nameMinLength: "Name must be at least 3 characters",
          codeRequired: "Access code is required",
          codeMinLength: "Code must be at least 8 characters",
        },
      },
      types: {
        house: "House",
        apartment: "Apartment",
        other: "Other",
      },
    },
  },
};

export default english;

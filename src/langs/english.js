const english = {
  messages: {
    greet: "Hello', {user}",
    chat: {
      initialMessage: "Hi 👋 How can I help you today, {name}?",
      title: "Task Assistant",
      placeholder: "Type a reply...",
      askType:
        "Would you like to create this suggestion as a 'task' or a 'goal'?",
      askTitle: "What will be the task title? (Current: {current})",
      askDescription:
        "Do you want to edit the description? (Current: {current})",
      askPriority: "What priority should it have? (e.g., 1, 2, 3)",
      askStartDate: "What is the start date? (Current: {current})",
      askStartTime: "What time does it start?",
      askEstimatedTime: "How many minutes will it take approximately?",
      askLocation: "Where will it take place?",
      askRecurrence: "How often will it repeat? (e.g., daily, weekly)",
      askStatus: "What is the initial status? (e.g., pending, in progress)",
      completed: "Task created! You can save it or continue editing.",
    },
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
    },
    settings: {
      category: "Categories",
      warehouse: "Warehouses",
      priority: "Priorities",
      role: "Roles",
      status: "Statuses",
      hometype: "Home Types",
      type: "Health Types",
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
      message: "Do you want to delete the selected item?",
      confirm: "Confirm deletion",
      items: {
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
        duration: "Duration",
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
      },
      currentAmount: "<strong>{amount}</strong> current",
    },
    summary: {
      title: "Summary for",
    },
  },
};

export default english;

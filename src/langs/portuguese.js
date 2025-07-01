const portuguese = {
  messages: {
    greet: "Olá",
    chat: {
      initialMessage: "Olá 👋 Como posso te ajudar hoje, {name}?",
    },
    vitalSigns: "Sinais Vitais",
    medicalInformation: "Informação Médica",
    complementaryData: "Dados Complementares",
    medicalExamsTitle: "Exames Médicos",
    vitalSignsnoData:
      "Você não atualizou os dados dos sinais vitais e tratamentos",
    medicalInfonoData: "Nenhuma informação médica foi definida",
    complementaryDatanoData:
      "As informações complementares não foram atualizadas",
    medicalExamsnoData: "Nenhum exame médico foi realizado",
    cardMedicamento: "Medicação Atual",
    cardAlergias: "Alergias",
    cardAntecedentesPersonales: "Histórico Pessoal",
    cardAntecedentesFamiliares: "Histórico Familiar",
    cardPlanVacunacion: "Plano de Vacinação",
    cardDiagnostico: "Diagnóstico",
    cardConsultaMedica: "Consulta Médica",
    menu: {
      desire: {
        title: "Desejos",
        description: "Listas de desejos e compras",
      },
      finance: {
        title: "Finanças",
        description: "Renda, despesas, orçamentos",
      },
      task: {
        title: "Tarefas",
        description: "Organize atividades",
      },
      personwarehouse: {
        title: "Armazéns",
        description: "Gerencie inventários",
      },
      product: {
        title: "Produtos",
        description: "Catálogo de produtos",
      },
      file: {
        title: "Arquivos",
        description: "Documentos importantes",
      },
      chat: {
        title: "Chat",
        description: "Comunicação com contatos",
      },
      homes: {
        title: "Casa",
        description: "Gestão da casa",
      },
    },
    viewTitles: {
      physicalExams: "Exames Físicos",
      tasks: "Tarefas",
      treatments: "Tratamentos",
      personalBackground: "Antecedentes Pessoais",
      familyBackground: "Antecedentes Familiares",
      medicalExams: "Exames Médicos",
      diagnosis: "Diagnósticos",
      medicalConsultations: "Consultas Médicas",
      incomes: "Receitas",
      expenses: "Despesas",
    },
    settings: {
      category: "Categorias",
      warehouse: "Armazéns",
      priority: "Prioridades",
      role: "Funções",
      status: "Estados",
      hometype: "Tipos de Casa",
      type: "Tipos de Saúde",
    },
    taskForm: {
      dialogTitle: "Detalhes da Tarefa",
      fields: {
        title: "Título da tarefa",
        date: "Data",
        time: "Hora",
        priority: "Prioridade",
        type: {
          label: "Tipo",
          task: "Tarefa",
          event: "Evento",
        },
        status: "Estado",
        category: "Categoria",
        recurrence: "Recorrência",
        description: "Descrição",
        comments: "Comentários",
        participants: "Participantes",
        estimatedTime: "Tempo estimado (hrs)",
        location: "Localização",
        endDate: "Data de término",
        endTime: "Hora de término",
      },
      buttons: {
        addDetails: "Adicionar detalhes",
        hideDetails: "Ocultar detalhes",
        cancel: "Cancelar",
        save: "Salvar",
        confirmDelete: "Aceitar",
        close: "Fechar",
        previous: "Anterior",
        next: "Próximo",
        saveAndClose: "Salvar e Fechar",
      },
      validation: {
        required: "Este campo é obrigatório",
        positiveNumber: "Deve ser um número positivo válido",
      },
      today: "Hoje",
      titles: {
        new: "Adicionar Nova Tarefa",
        edit: "Editar Tarefa",
      },
    },
    taskTypes: {
      Tarea: "Tarefa",
      Evento: "Evento",
    },
    formInstructions: "Introduza os dados solicitados abaixo",
    steps: {
      "Información Básica": {
        title: "Informação Básica",
        subtitle: "Insira o título e descrição",
      },
      Asignación: {
        title: "Atribuição",
        subtitle: "Selecione responsáveis",
      },
      Programación: {
        title: "Agendamento",
        subtitle: "Escolha data e hora",
      },
    },
    buttons: {
      addDetails: "Adicionar detalhes",
      hideDetails: "Ocultar detalhes",
      cancel: "Cancelar",
      save: "Salvar",
      confirmDelete: "Aceitar",
      close: "Fechar",
      previous: "Anterior",
      next: "Próximo",
      saveAndClose: "Salvar e Fechar",
    },
    deleteDialog: {
      title: "Excluir {item}",
      message: "Você deseja excluir o item seleccionado?",
      confirm: "Confirmar exclusão",
      items: {
        task: "tarefa",
        physicalExam: "exame físico",
        treatment: "tratamento",
        personalBackground: "antecedente pessoal",
        familyBackground: "antecedente familiar",
        medicalExam: "exame médico",
        diagnosis: "diagnóstico",
        medicalConsultation: "consulta médica",
        default: "item",
      },
    },
    personDetails: {
      age: {
        withValue: "Idade: {age} anos",
        withoutValue: "Idade: Não especificada",
      },
      documentType: {
        withValue: "Tipo de identificação: {type}",
        withoutValue: "Sem tipo de identificação",
      },
      documentNumber: {
        withValue: "ID do paciente: {number}",
        withoutValue: "ID não especificado",
      },
    },
    //examenes fisicos
    physicalExam: {
      formInstructions: "Preencha todos os campos obrigatórios do exame físico",
      steps: {
        vital_signs: {
          title: "Sinais Vitais",
          subtitle: "Dados básicos do paciente",
        },
        body_measurements: {
          title: "Medidas Corporais",
          subtitle: "Peso, altura e IMC",
        },
        observations: {
          title: "Observações",
          subtitle: "Exame por sistemas",
        },
      },
      fields: {
        blood_pressure: "Pressão Arterial (mmHg)",
        pulse: "Frequência Cardíaca (bpm)",
        temperature: "Temperatura (°C)",
        respiratory_rate: "Frequência Respiratória (rpm)",
        exam_date: "Data do Exame",
        weight: "Peso (kg)",
        height: "Altura (m)",
        bmi: "Índice de Massa Corporal",
        neurological_observations: "Observações Neurológicas",
        cardiovascular_observations: "Observações Cardiovasculares",
        respiratory_observations: "Observações Respiratórias",
        digestive_observations: "Observações Digestivas",
        urinary_observations: "Observações Urinárias",
        other_findings: "Outros Achados",
      },
      titles: {
        new: "Novo Exame Físico",
        edit: "Editar Exame Físico",
      },
    },
    //tratamiento
    treatment: {
      formInstructions: "Preencha todos os campos obrigatórios do tratamento",
      steps: {
        medication: {
          title: "Medicação",
          subtitle: "Detalhes da medicação",
        },
        details: {
          title: "Detalhes",
          subtitle: "Instruções e propósito",
        },
        dates: {
          title: "Datas",
          subtitle: "Período do tratamento",
        },
      },
      fields: {
        medication: "Medicação",
        dosage: "Dosagem",
        frequency: "Frequência",
        duration: "Duração",
        instructions: "Instruções",
        purpose: "Propósito",
        startDate: "Data de início",
        endDate: "Data de término",
        observations: "Observações",
      },
      titles: {
        new: "Novo Tratamento",
        edit: "Editar Tratamento",
      },
      validationMessages: {
        medication: {
          required: "A medicação é obrigatória",
          maxLength: "A medicação não pode exceder 100 caracteres",
        },
        dosage: {
          maxLength: "A dosagem não pode exceder 50 caracteres",
        },
        frequency: {
          maxLength: "A frequência não pode exceder 50 caracteres",
        },
        duration: {
          maxLength: "A duração não pode exceder 50 caracteres",
        },
        startDate: {
          invalid: "Data de início inválida",
        },
        endDate: {
          invalid: "Data de término inválida",
        },
      },
    },
    //antecedetnes personales
    personalBackground: {
      formInstructions: "Preencha todos os campos de histórico pessoal",
      steps: {
        details: {
          title: "Detalhes",
          subtitle: "Informação da condição médica",
        },
        additional: {
          title: "Informação Adicional",
          subtitle: "Observações clínicas",
        },
        dates: {
          title: "Datas",
          subtitle: "Cronologia da condição",
        },
      },
      fields: {
        type: "Tipo de condição",
        description: "Condição médica",
        details: "Detalhes clínicos",
        startDate: "Data de início",
        endDate: "Data de resolução",
        status: "Estado atual",
        severity: "Nível de gravidade",
      },
      titles: {
        new: "Adicionar Histórico Pessoal",
        edit: "Editar Histórico Pessoal",
        view: "Histórico Médico Pessoal",
      },
      validationMessages: {
        type: {
          required: "O tipo de condição é obrigatório",
        },
        description: {
          required: "A descrição médica é obrigatória",
          maxLength: "A descrição não pode exceder 200 caracteres",
        },
      },
      notRecorded: "Sem dados registrados",
      noRecords: "Nenhum histórico pessoal encontrado",
    },
    //antecedentes familiares
    familyBackground: {
      formInstructions: "Preencha todos os campos de histórico familiar",
      steps: {
        details: {
          title: "Dados Familiares",
          subtitle: "Informação do familiar",
        },
        additional: {
          title: "Informação Médica",
          subtitle: "Detalhes da condição de saúde",
        },
      },
      fields: {
        type: "Tipo de Condição",
        relationship: "Parentesco",
        disease: "Doença/Condição",
        details: "Detalhes Médicos",
        date: "Data de Registro",
        diagnosis_age: "Idade no Diagnóstico",
      },
      titles: {
        new: "Adicionar Histórico Familiar",
        edit: "Editar Histórico Familiar",
        view: "Histórico Médico Familiar",
      },
      validationMessages: {
        type: {
          required: "O tipo de condição é obrigatório",
        },
        relationship: {
          required: "O parentesco é obrigatório",
        },
        disease: {
          required: "A doença/condição é obrigatória",
          maxLength: "O nome da doença não pode exceder 100 caracteres",
        },
        diagnosis_age: {
          invalid: "A idade deve estar entre 0 e 120 anos",
        },
      },
      notRecorded: "Sem dados registrados",
      noRecords: "Nenhum histórico familiar encontrado",
    },
    medicalExams: {
      formInstructions: "Preencha todos os campos do exame médico",
      steps: {
        examDetails: {
          title: "Detalhes do Exame",
          subtitle: "Informações básicas do exame",
        },
        results: {
          title: "Resultados",
          subtitle: "Resultados e observações do exame",
        },
      },
      fields: {
        type: "Tipo de Exame",
        exam_name: "Nome do Exame",
        results: "Resultados",
        observations: "Observações",
        date: "Data do Exame",
        file: "Arquivo Anexado",
        attach_file: "Anexar Arquivo",
      },
      actions: {
        viewFile: "Visualizar Arquivo",
        downloadFile: "Baixar",
      },
      titles: {
        new: "Adicionar Exame Médico",
        edit: "Editar Exame Médico",
        view: "Exames Médicos",
      },
      validationMessages: {
        type: {
          required: "O tipo de exame é obrigatório",
        },
        exam_name: {
          maxLength: "O nome não pode exceder 200 caracteres",
          required: "A nome do exame é obrigatória",
        },
        date: {
          required: "A data do exame é obrigatória",
          invalid: "A data deve ser válida",
        },
        file: {
          invalidType:
            "São permitidos apenas imagens (PNG, JPG), PDF e documentos Word",
          sizeExceeded: "O tamanho do arquivo deve ser menor que 5MB",
        },
      },
      notRecorded: "Sem dados registrados",
      noRecords: "Nenhum exame médico encontrado",
    },
    diagnoses: {
      formInstructions: "Preencha todos os campos do diagnóstico",
      steps: {
        details: {
          title: "Detalhes do diagnóstico",
          subtitle: "Informações principais do diagnóstico",
        },
        additional: {
          title: "Informações adicionais",
          subtitle: "Notas e observações",
        },
      },
      fields: {
        type: "Tipo de diagnóstico",
        description: "Descrição",
        cie10_code: "Código CIE-10",
        notes: "Notas",
        date: "Data do diagnóstico",
      },
      titles: {
        new: "Novo diagnóstico",
        edit: "Editar diagnóstico",
        view: "Diagnósticos",
      },
      validationMessages: {
        type: {
          required: "O tipo de diagnóstico é obrigatório",
        },
        description: {
          required: "A descrição é obrigatória",
          maxLength: "A descrição não pode exceder 500 caracteres",
        },
        cie10_code: {
          maxLength: "O código CIE-10 não pode exceder 20 caracteres",
        },
        date: {
          required: "A data é obrigatória",
        },
      },
      notRecorded: "Não registrado",
      noRecords: "Nenhum diagnóstico encontrado",
    },
    consultations: {
      formInstructions: "Preencha todos os campos da consulta médica",
      steps: {
        details: {
          title: "Detalhes da Consulta",
          subtitle: "Informação principal da consulta",
        },
        additional: {
          title: "Informação Adicional",
          subtitle: "Notas e observações",
        },
      },
      fields: {
        type: "Tipo de Consulta",
        profesional: "Profissional",
        reason: "Motivo da Consulta",
        medicalNotes: "Notas Médicas",
        date: "Data da Consulta",
      },
      validationMessages: {
        type: {
          required: "O tipo de consulta é obrigatório",
        },
        profesional: {
          required: "O profissional é obrigatório",
          maxLength: "Não pode exceder 100 caracteres",
        },
        reason: {
          required: "O motivo é obrigatório",
          maxLength: "Não pode exceder 500 caracteres",
        },
        date: {
          required: "A data é obrigatória",
          invalid: "A data não é válida",
        },
      },
    },
    personManagement: {
      formInstructions:
        "Preencha todos os campos obrigatórios para registrar as informações da pessoa",
      edit_title: "Editar Pessoa",
      create_title: "Nova Pessoa",
      no_changes: "Nenhuma alteração foi feita",
      save_error: "Erro ao salvar as informações",
      steps: {
        basic_info: {
          title: "Informações Básicas",
          subtitle: "Dados principais da pessoa",
        },
        personal_info: {
          title: "Informações Pessoais",
          subtitle: "Detalhes pessoais e contato",
        },
        medical_info: {
          title: "Informações Médicas",
          subtitle: "Dados médicos e documentação",
        },
      },
      fields: {
        profile_image: "Imagem de perfil",
        name: "Nome completo",
        username: "Nome de usuário",
        password: "Senha",
        language: "Idioma",
        birth_date: "Data de nascimento",
        age: "Idade",
        gender: "Gênero",
        emergency_contact: "Contato de emergência",
        email: "E-mail",
        phone: "Telefone",
        address: "Endereço",
        medical_record_number: "Número do prontuário médico",
        document_type: "Tipo de documento",
        document_number: "Número do documento",
        health_coverage: "Cobertura de saúde",
        coverage_name: "Nome da cobertura",
        blood_type: "Tipo sanguíneo",
      },
      genders: {
        male: "Masculino",
        female: "Feminino",
        other: "Outro",
      },
      documentTypes: {
        id: "RG",
        passport: "Passaporte",
        driver_license: "Carteira de motorista",
      },
      healthCoverages: {
        public: "Pública",
        private: "Privada",
        none: "Nenhuma",
      },
      validation: {
        name_required: "O nome é obrigatório",
        email_valid: "O e-mail deve ser válido",
        image_size: "A imagem deve ser menor que 500KB",
      },
    },
    finances: {
      formInstructions: {
        income: "Preencha todos os campos do registro de receitas",
        expense: "Preencha todos os campos do registro de despesas",
        finance: "Preencha todos os campos do registro financeiro",
      },
      steps: {
        financialDetails: {
          title: "Detalhes Financeiros",
          subtitle: "Informações básicas do registro",
        },
        description: {
          title: "Descrição",
          subtitle: "Detalhes adicionais",
        },
      },
      fields: {
        type: "Tipo de Transação",
        method: "Método de Pagamento",
        income: "Receita",
        spent: "Despesa",
        description: "Descrição",
        date: "Data",
        file: "Comprovante",
        attach_file: "Anexar Comprovante",
      },
      actions: {
        viewFile: "Ver Comprovante",
        downloadFile: "Baixar",
      },
      titles: {
        new: {
          income: "Adicionar Receita",
          expense: "Adicionar Despesa",
          finance: "Adicionar Registro Financeiro",
        },
        edit: {
          income: "Editar Receita",
          expense: "Editar Despesa",
          finance: "Editar Registro Financeiro",
        },
        view: {
          income: "Registros de Receitas",
          expense: "Registros de Despesas",
          finance: "Registros Financeiros",
        },
      },
      validationMessages: {
        type: {
          required: "O tipo é obrigatório",
          maxLength: "O tipo não pode exceder 50 caracteres",
        },
        method: {
          maxLength: "O método não pode exceder 50 caracteres",
        },
        income: {
          number: "A receita deve ser um número",
          precision: "A receita deve ter no máximo 2 casas decimais",
        },
        spent: {
          number: "A despesa deve ser um número",
          precision: "A despesa deve ter no máximo 2 casas decimais",
        },
        description: {
          maxLength: "A descrição não pode exceder 255 caracteres",
        },
        date: {
          required: "A data é obrigatória",
          invalid: "A data deve ser válida",
        },
        file: {
          invalidType: "Apenas imagens (PNG, JPG) são permitidas",
          sizeExceeded: "O tamanho do arquivo deve ser menor que 500KB",
        },
      },
      notRecorded: "Sem registro",
      noRecords: "Nenhum registro financeiro encontrado",
      header: {
        title: "Finanças Domésticas",
        subtitle: "Controle familiar de receitas e despesas",
      },
      suggestions: {
        title: "Sugestões Inteligentes",
        alerts: {
          message: "Você tem {count} alerta para hoje",
          message_plural: "Você tem {count} alertas para hoje",
        },
      },
      comparison: {
        lastMonth: "Mês passado",
        thisMonth: "Este mês",
        vs: "vs {amount}",
      },
      sections: {
        balance: "Saldo",
        movements: "Movimentações",
        suggestions: "Sugestões",
      },
      currentAmount: "<strong>{amount}</strong> atual",
    },
    summary: {
      title: "Resumo de",
    },
  },
};

export default portuguese;

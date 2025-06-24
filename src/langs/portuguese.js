const portuguese = {
  messages: {
    greet: "Olá",
    chat: {
      initialMessage: "Olá 👋 Como posso te ajudar hoje, {name}?",
    },
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
    settings: {
    category: "Categorias",
    warehouse: "Armazéns",
    priority: "Prioridades",
    role: "Funções",
    status: "Estados",
    hometype: "Tipos de Casa",
    type: "Tipos de Saúde"
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
          event: "Evento"
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
        endTime: "Hora de término"
      },
      buttons: {
        addDetails: "Adicionar detalhes",
        hideDetails: "Ocultar detalhes",
        cancel: "Cancelar",
        save: "Salvar",
        confirmDelete: "Aceitar",
        "close": "Fechar",
      "previous": "Anterior",
      "next": "Próximo",
      "saveAndClose": "Salvar e Fechar"
      },
      validation: {
        required: "Este campo é obrigatório",
        positiveNumber: "Deve ser um número positivo válido"
      },
      today: "Hoje",
      titles: {
      "new": "Adicionar Nova Tarefa",
      "edit": "Editar Tarefa"
    }
    },
    taskTypes: {
    "Tarea": "Tarefa",
    "Evento": "Evento"
  },
  formInstructions: "Introduza os dados solicitados abaixo",
   "steps": {
      "Información Básica": {
        "title": "Informação Básica",
        "subtitle": "Insira o título e descrição"
      },
      "Asignación": {
        "title": "Atribuição",
        "subtitle": "Selecione responsáveis"
      },
      "Programación": {
        "title": "Agendamento",
        "subtitle": "Escolha data e hora"
      }
    },
    buttons: {
        addDetails: "Adicionar detalhes",
        hideDetails: "Ocultar detalhes",
        cancel: "Cancelar",
        save: "Salvar",
        confirmDelete: "Aceitar",
        "close": "Fechar",
      "previous": "Anterior",
      "next": "Próximo",
      "saveAndClose": "Salvar e Fechar"
      },
      "deleteDialog": {
    "title": "Excluir {item}",
    "message": "Deseja excluir este(a) {item}?",
    "confirm": "Confirmar exclusão",
    "items": {
      "task": "tarefa",
      "user": "usuário",
      "event": "evento",
      "default": "item"
    }
  }
  },
};

export default portuguese;

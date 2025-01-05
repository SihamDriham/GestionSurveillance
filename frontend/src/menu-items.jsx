/*const menuItems = {
  items: [
    {
      id: 'navigation',
      title: '',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        }
      ]
    },
   {
      id: 'ui-forms',
      title: '',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Exams',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/tables/exams'
        },
        {
          id: 'table',
          title: 'Surveillance',
          type: 'item',
          icon: 'feather icon-clipboard',
          url: '/tables/surveillance'
        },
        {
          id: 'maps',
          title: 'Emploi',
          type: 'item',
          icon: 'feather icon-calendar',
          url: '/tables/emploi'
        },
        {
          id: 'charts',
          title: 'Options',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/tables/option'
        },
        {
          id: 'table',
          title: 'Département',
          type: 'item',
          icon: 'feather icon-server',
          url: '/departement'
        },
        {
          id: 'sample-page',
          title: 'Locaux',
          type: 'item',
          url: '/local',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
      ]
    },
    
    {
      id: 'navigation',
      title: '',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Déconnexion',
          type: 'item',
          icon: 'feather icon-log-out',
          url: '/logout'
        }
      ]
    },
     
      
  ]
};

export default menuItems;
*/

const menuItems = {
  items: [
    {
      id: 'navigation',
      title: '',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/sessionDashboard/:idSession'
        }
      ]
    },
   {
      id: 'ui-forms',
      title: '',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Exams',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/exams/:idSession'
        },
        {
          id: 'table',
          title: 'Surveillance',
          type: 'item',
          icon: 'feather icon-clipboard',
          url: '/surveillance/:idSession'
        },
        {
          id: 'maps',
          title: 'Emploi',
          type: 'item',
          icon: 'feather icon-calendar',
          url: '/tables/emploi'
        },
        {
          id: 'chart',
          title: 'Options',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/option/:idSession'
        },
        {
          id: 'dept',
          title: 'Département',
          type: 'item',
          icon: 'feather icon-server',
          url: '/departement/:idSession'
        },
        {
          id: 'sample-page',
          title: 'Locaux',
          type: 'item',
          url: '/local/:idSession',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'sample-page2',
          title: 'Session',
          type: 'item',
          url: '/Sessions',
          classes: 'nav-item',
          icon: 'feather icon-aperture'
        },
      ]
    },
    
    {
      id: 'navigation',
      title: '',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Déconnexion',
          type: 'item',
          icon: 'feather icon-log-out',
          url: '/logout'
        }
      ]
    },
     
      
  ]
};

export default menuItems;
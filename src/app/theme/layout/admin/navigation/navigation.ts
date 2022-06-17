import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}


const OperatorItems =[{
  id: 'odbus',
  title: '',
  //translate: 'NAV.ODBUS',
  type: 'group',
  icon: 'feather icon-home',
  children: [
    {
      id: 'dashboards',
      title: 'Dashboards',
      //translate: 'NAV.DASHBOARDS',
      type: 'item',
      icon: 'feather icon-home',
      url: 'dashboard/landing'
    },
    {
      id: 'busmanagement',
      title: 'Bus Management',
      //translate: 'NAV.BUSMANAGEMENT',
      type: 'collapse',
      icon: 'feather icon-tv',
      children: [
        {
          id: 'managelocation',
          title: 'Location',
          type: 'item',
          icon: 'feather icon-map-pin',
          url: 'busmanagement/managelocation'
        },
        {
          id: 'BoardingDropping',
          title: 'Boarding/Dropping',
          type: 'item',
          icon:'feather icon-minimize-2',
          url: 'busmanagement/BoardingDropping'
        },
        {
          id: 'manageus',
          title: 'Bus',
          type: 'item',
          icon:'feather icon-gitlab',
          url: 'busmanagement/managebus'
        },
       
        {
          id: 'coupon',
          title: 'Coupon',
          type: 'item',
          icon:'feather icon-tag',
          url: 'busmanagement/coupon'
        },
        {
          id: 'gallery',
          title: 'Gallery',
          type: 'item',
          icon:'feather icon-image',
          url: 'busmanagement/busgallery'
        },
        {
          id: 'seatfare',
          title: 'Seat Fare',
          type: 'item',
          icon:'feather icon-hash',
          url: 'busmanagement/seatfare'
        },
        {
          id: 'bustype',
          title: 'Bus Type',
          type: 'item',
          icon:'feather icon-share-2',
          url: 'busmanagement/bustype'
        },
        {
          id: 'SeatLayout ',
          title: 'Seat Layout',
          type: 'item',
          icon:'feather icon-server',
          url: 'busmanagement/SeatLayout'
        },
        {
          id: 'CancellationSlab',
          title: 'Cancellation Slab',
          type: 'item',
          icon:'feather icon-sidebar',
          url: 'busmanagement/cancellationslab'
        },
        {
          id: 'BusSchedule',
          title: 'Bus Schedule',
          type: 'item',
          icon:'feather icon-twitter',
          url: 'busmanagement/busschedule'
        },
        {
          id: 'Offers',
          title: 'Offers',
          type: 'item',
          icon:'feather icon-watch',
          url: 'busmanagement/offers'
        }


      ]
    },
    {
      id: 'bookingmanagement',
      title: 'Booking Management',
      type: 'collapse',
      icon: 'feather icon-gitlab',
      children: [
        {
          id: 'BusCancellation',
          title: 'Bus Cancellation',
          type: 'item',
          icon:'feather icon-wifi-off',
          url: 'bookingmanagement/buscancellation'
        },
        {
          id: 'seatBlock',
          title: 'seat  Block',
          type: 'item',
          icon:'feather icon-slash',
          url: 'bookingmanagement/seatblock'
        },
        {
          id: 'seatopen',
          title: 'Seat Open',
          type: 'item',
          icon:'feather icon-shield',
          url: 'bookingmanagement/seatopen'
        },
        {
          id: 'extraseatblock',
          title: 'Extra Seat Block',
          type: 'item',
          icon:'feather icon-shield',
          url: 'bookingmanagement/extraseatblock'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: 'feather icon-file-text',
      children: [   
        // {
        //   id: 'seatopenreport',
        //   title: 'Seat Open Report',
        //   type: 'item',
        //   icon:'feather icon-pie-chart',
        //   url: 'reports/seatopenReport'
        // },
        {
          id: 'extraseatopenreport',
          title: 'Extra Seat Open Report',
          type: 'item',
          icon:'feather icon-pie-chart',
          url: 'reports/extraseatopenReport'
        },
        // {
        //   id: 'seatblockreport',
        //   title: 'Seat Block Report',
        //   type: 'item',
        //   icon:'feather icon-pie-chart',
        //   url: 'reports/seatblockReport'
        // },
        {
          id: 'cancleticketsReport',
          title: 'Cancel Tickets Report',
          type: 'item',
          icon:'feather icon-pie-chart',
          url: 'reports/cancleticketsReport'
        },
        {
          id: 'buscancellationreport',
          title: 'Bus Cancellation Report',
          type: 'item',
          icon:'feather icon-pie-chart',
          url: 'reports/buscancellationreport'
        }
      ]
    },
    {
      id: 'howtouse',
      title: 'How to Use',
      type: 'item',
      icon: 'feather icon-droplet',
      url: 'howtouse'
    },

  ]
}];

const AgentItems = [
  {
    id: 'odbus',
    title: '',
    //translate: 'NAV.ODBUS',
    type: 'group',
    icon: 'feather icon-home',
    children: [
      {
        id: 'dashboards',
        title: 'Dashboards',
        //translate: 'NAV.DASHBOARDS',
        type: 'item',
        icon: 'feather icon-home',
        url: 'dashboard/landing'
      },
      {
        id: 'agent',
        title: 'Agent',
        type: 'collapse',
        icon: 'add_shopping_cart',
        children: [
          {
            id: 'notification',
            title: 'Notification',
            type: 'item',
            url: 'agent/notification'
          }, 
          {
            id: 'wallet',
            title: 'Wallet',
            type: 'item',
            url: 'agent/wallet'
          },
          {
            id: 'walletreport',
            title: 'Wallet Report',
            type: 'item',
            url: 'agent/walletreport'
          },
          {
            id: 'cancellationreport',
            title: 'Cancellation Report',
            type: 'item',
            url: 'agent/cancellationreport'
          },
          {
            id: 'completereport',
            title: 'Complete Report',
            type: 'item',
            url: 'agent/completereport'
          },
          {
            id: 'commissionreport',
            title: 'Commission Report',
            type: 'item',
            url: 'agent/commissionreport'
          },
          {
            id: 'commissionslab',
            title: 'Commission Slab',
            type: 'item',
            url: 'agent/commissionslab'
          },
          {
            id: 'customercommissionslab',
            title: 'Customer Commission Slab',
            type: 'item',
            url: 'agent/customercommissionslab'
          },
        ]
      },
    ]
  }
];

const NavigationItems = [
  {
    id: 'odbus',
    title: '',
    //translate: 'NAV.ODBUS',
    type: 'group',
    icon: 'feather icon-home',
    children: [
      {
        id: 'dashboards',
        title: 'Dashboards',
        //translate: 'NAV.DASHBOARDS',
        type: 'item',
        icon: 'feather icon-home',
        url: 'dashboard/landing'
      },
      {
        id: 'busmanagement',
        title: 'Bus Management',
        //translate: 'NAV.BUSMANAGEMENT',
        type: 'collapse',
        icon: 'feather icon-tv',
        children: [
          {
            id: 'managelocation',
            title: 'Location',
            type: 'item',
            icon: 'feather icon-map-pin',
            url: 'busmanagement/managelocation'
          },
          {
            id: 'BoardingDropping',
            title: 'Boarding/Dropping',
            type: 'item',
            icon:'feather icon-minimize-2',
            url: 'busmanagement/BoardingDropping'
          },
          {
            id: 'manageus',
            title: 'Bus',
            type: 'item',
            icon:'feather icon-gitlab',
            url: 'busmanagement/managebus'
          },
          {
            id: 'coupontype',
            title: 'CouponType',
            type: 'item',
            icon:'feather icon-tag',
            url: 'busmanagement/coupontype'
          },
          {
            id: 'coupon',
            title: 'Coupon',
            type: 'item',
            icon:'feather icon-tag',
            url: 'busmanagement/coupon'
          },
          {
            id: 'gallery',
            title: 'Gallery',
            type: 'item',
            icon:'feather icon-image',
            url: 'busmanagement/busgallery'
          },
          {
            id: 'seatfare',
            title: 'Seat Fare',
            type: 'item',
            icon:'feather icon-hash',
            url: 'busmanagement/seatfare'
          },


          {
            id: 'bustype',
            title: 'Bus Type',
            type: 'item',
            icon:'feather icon-share-2',
            url: 'busmanagement/bustype'
          },
          {
            id: 'safety',
            title: 'Safety',
            type: 'item',
            icon:'feather icon-sunrise',
            url: 'busmanagement/safety'
          },
          {
            id: 'seatingtype',
            title: 'Seating Type',
            type: 'item',
            icon:'feather icon-cloud',
            url: 'busmanagement/seatingtype'
          },
          {
            id: 'Amenities',
            title: 'Amenities',
            type: 'item',
            icon:'feather icon-heart-on',
            url: 'busmanagement/amenities'
          },

          {
            id: 'SeatLayout ',
            title: 'Seat Layout',
            type: 'item',
            icon:'feather icon-server',
            url: 'busmanagement/SeatLayout'
          },
          {
            id: 'CancellationSlab',
            title: 'Cancellation Slab',
            type: 'item',
            icon:'feather icon-sidebar',
            url: 'busmanagement/cancellationslab'
          },
          {
            id: 'BusOperator',
            title: 'Bus Operator',
            type: 'item',
            icon:'feather icon-sun',
            url: 'busmanagement/busoperator'
          },
          {
            id: 'BusSchedule',
            title: 'Bus Schedule',
            type: 'item',
            icon:'feather icon-twitter',
            url: 'busmanagement/busschedule'
          },
          // {
          //   id: 'Settings',
          //   title: 'Fare Setting',
          //   type: 'item',
          //   url: 'busmanagement/settings'
          // },
          {
            id: 'Offers',
            title: 'Offers',
            type: 'item',
            icon:'feather icon-watch',
            url: 'busmanagement/offers'
          },
          {
            id: 'BusSequence',
            title: 'Bus Sequence',
            type: 'item',
            icon:'feather icon-sliders',
            url: 'busmanagement/BusSequence'
          }
            // ,
            // {
            //   id   : 'formValidation',
            //   title: 'Demo Items',
            //   type : 'item',
            //   url  : 'busmanagement/formValidation'
            // }

        ]
      },
      {
        id: 'bookingmanagement',
        title: 'Booking Management',
        //translate: 'NAV.BOOKINGMANAGEMENT',
        type: 'collapse',
        icon: 'feather icon-gitlab',
        children: [
          {
            id: 'ticketfareslab',
            title: 'Ticket Fare Slab',
            type: 'item',
            icon:'feather icon-wifi-off',
            url: 'bookingmanagement/ticketfareslab'
          },
          {
            id: 'BusCancellation',
            title: 'Bus Cancellation',
            type: 'item',
            icon:'feather icon-wifi-off',
            url: 'bookingmanagement/buscancellation'
          },

          {
            id: 'seatBlock',
            title: 'Seat Block',
            type: 'item',
            icon:'feather icon-slash',
            url: 'bookingmanagement/seatblock'
          },
          {
            id: 'extraseatblock',
            title: 'Extra Seat Block',
            type: 'item',
            icon:'feather icon-shield',
            url: 'bookingmanagement/extraseatblock'
          },
          {
            id: 'seatopen',
            title: 'Seat Open',
            type: 'item',
            icon:'feather icon-shield',
            url: 'bookingmanagement/seatopen'
          },
          {
            id: 'bookingseized',
            title: 'Booking Seized',
            type: 'item',
            icon:'feather icon-command',
            url: 'bookingmanagement/bookingseized'
          },
          {
            id: 'specialfare',
            title: 'Special Fare',
            type: 'item',
            icon:'feather icon-umbrella',
            url: 'bookingmanagement/specialfare'
          },
          {
            id: 'ownerfare',
            title: 'Owner Fare',
            type: 'item',
            icon:'feather icon-trending-up',
            url: 'bookingmanagement/ownerfare'
          },
          {
            id: 'festivalfare',
            title: 'Festival Fare',
            type: 'item',
            icon:'feather icon-trending-up',
            url: 'bookingmanagement/festivalfare'
          },
          {
            id: 'ownerpayment',
            title: 'Owner Payment',
            type: 'item',
            icon:'feather icon-user-check',
            url: 'bookingmanagement/ownerpayment'
          },
          //   {
          //       id   : 'CancellationSlab',
          //       title: 'Cancellation Slab',
          //       type : 'item',
          //       url  : 'busmanagement/CancellationSlab'
          //   }
        ]
      },
      {
        id: 'reports',
        title: 'Reports',
        // translate: 'NAV.REPORTS',
        type: 'collapse',
        icon: 'feather icon-file-text',
        children: [
          
          // {
          //   id: 'seatopenreport',
          //   title: 'Seat Open Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/seatopenReport'
          // },
          {
            id: 'extraseatopenreport',
            title: 'Extra Seat Open Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/extraseatopenReport'
          },
          {
            id: 'completereport',
            title: 'Complete Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/completeReport'
          },
          // {
          //   id: 'seatblockreport',
          //   title: 'Seat Block Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/seatblockReport'
          // },
          {
            id: 'cancleticketsReport',
            title: 'Cancel Tickets Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/cancleticketsReport'
          },
          {
            id: 'pendingpnrreport',
            title: 'Pending PNR Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/pendingpnrreport'
          },
          {
            id: 'failedtransactionreport',
            title: 'Failed Transaction Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/failedtransactionreport'
          },
          {
            id: 'buscancellationreport',
            title: 'Bus Cancellation Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/buscancellationreport'
          },
          {
            id: 'ownerpaymentreport',
            title: 'Owner Payment Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/ownerpaymentreport'
          },
          // {
          //   id   : 'cleartransactionreport',
          //   title: 'Clear Transaction Tickets Report',
          //   type : 'item',
          //   url  : 'reports/cleartransactionreport'
          // },
          {
            id: 'contactreport',
            title: 'Contact Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/contactreport'
          },
          {
            id: 'couponuseduserreport',
            title: 'Coupon Used User Report',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/couponuseduserreport'
          },
        ]
      },
      {
        id: 'setting',
        title: 'Website CMS Setting',
        type: 'collapse',
        icon: 'feather icon-layers',
        children: [
          {
            id: 'pagecontent',
            title: 'Page Content',
            type: 'item',
            icon:'feather icon-github',
            url: 'setting/pagecontent'
          }, 
          {
            id: 'socialmedia',
            title: 'Social Media',
            type: 'item',
            icon:'feather icon-award',
            url: 'setting/socialmedia'
          },
          {
            id: 'userreview',
            title: 'User Review',
            type: 'item',
            icon:'feather icon-message-circle',
            url: 'setting/userreview'
          },
          {
            id: 'testimonial',
            title: 'Testimonial',
            type: 'item',
            icon:'feather icon-mail',
            url: 'setting/testimonial'
          },
          {
            id: 'bannermanagement',
            title: 'Banner Management',
            type: 'item',
            icon:'feather icon-package',
            url: 'setting/bannermanagement'
          },
          {
            id: 'seosetting',
            title: 'SEO Setting',
            type: 'item',
            icon:'feather icon-link',
            url: 'setting/seosetting'
          },
          {
            id: 'specialslider',
            title: 'Special Slider',
            type: 'item',
            icon:'feather icon-speaker',
            url: 'setting/specialslider'
          },
          {
            id: 'mastersetting',
            title: 'Master Setting',
            type: 'item',
            icon:'icon feather icon-target',
            url: 'setting/mastersetting'
          }
        ]
      },
      {
        id: 'association',
        title: 'Association',
        type: 'collapse',
        icon: 'feather icon-command',
        // icon: 'feather icon-thermometer',
        children: [  
          {
            id: 'association',
            title: 'Manage Association',
            type: 'item',
            icon:'feather icon-user-plus',
            url: 'setting/association'
          },
          {
            id: 'assignoperator',
            title: 'Assign Operator',
            type: 'item',
            icon:'feather icon-aperture',
            url: 'association/assignoperator'
          },
          {
            id: 'assignbus',
            title: 'Assign Bus',
            type: 'item',
            icon:'feather icon-bold',
            url: 'association/assignbus'
          },
          {
            id: 'assignagent',
            title: 'Assign Agent',
            type: 'item',
            icon:'feather icon-aperture',
            url: 'association/assignagent'
          },
          {
            id: 'bookingreport',
            title: 'Booking Report',
            type: 'item',
            icon:'feather icon-book',
            url: 'association/bookingreport'
          },
          {
            id: 'cancelreport',
            title: 'Cancel Report',
            type: 'item',
            icon:'feather icon-scissors',
            url: 'association/cancelreport'
          },
          {
            id: 'assignagentreport',
            title: 'Assign Agent Report',
            type: 'item',
            icon:'feather icon-loader',
            url: 'reports/assignagentreport'
          },
          {
            id: 'assignbusreport',
            title: 'Assign Bus Report',
            type: 'item',
            icon:'feather icon-briefcase',
            url: 'reports/assignbusreport'
          },
          {
            id: 'assignoperatorreport',
            title: 'Assign Operator Report',
            type: 'item',
            icon:'feather icon-aperture',
            url: 'reports/assignoperatorreport'
          },
        ]
      },

      {
        id: 'operator',
        title: 'Operators',
        type: 'collapse',
        icon: 'feather icon-users',
        children: [
         
          {
            id: 'user',
            title: 'Operators',
            type: 'item',
            icon:'feather icon-users',
            url: 'setting/user'
          },                    
          // {
          //   id: 'assignoperator',
          //   title: 'Assign Operators',
          //   type: 'item',
          //   icon:'feather icon-users',
          //   url: 'operator/assignoperator'
          // }, 
          // {
          //   id: 'assignoperatorbus',
          //   title: 'Assign OperatorsBus',
          //   type: 'item',
          //   icon:'feather icon-users',
          //   url: 'operator/assignoperatorbus'
          // }, 
          // {
          //   id: 'assignagent',
          //   title: 'Assign Agent',
          //   type: 'item',
          //   icon:'feather icon-users',
          //   url: 'operator/assignagent'
          // }, 
          // {
          //   id: 'operatorbookingreport',
          //   title: 'OperatorBookingReport',
          //   type: 'item',
          //   icon:'feather icon-users',
          //   url: 'operator/operatorbookingreport'
          // },
          // {
          //   id: 'operatorcancelreport',
          //   title: 'OperatorCancelReport',
          //   type: 'item',
          //   icon:'feather icon-users',
          //   url: 'operator/operatorcancelreport'
          // },
        ]
      },
      {
        // id: 'ticketinformation',
        title: 'Manage Agent',
        type: 'collapse',
        icon: 'feather icon-cloud',
        children: [         
          {
            id: 'agentwalletrequest',
            title: 'Agent Wallet Request',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/agentwalletrequest'
          },
          {
            id: 'agentwalletbalance',
            title: 'Agent Wallet Balance',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'setting/agentwalletbalance'
          },
          {
            id: 'agentalltransaction',
            title: 'Agent All Transaction',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'setting/agentalltransaction'
          },
          {
            id: 'agentfeedback',
            title: 'Agent Feedback',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'setting/agentfeedback'
          },
         
          {
            id: 'pushnotification',
            title: 'Push Notification',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'reports/pushnotification'
          },
          {
            id: 'agent',
            title: 'Agent Requested',
            type: 'item',
            icon:'feather icon-user-plus',
            url: 'setting/agent'
          },
          {
            id: 'ouragent',
            title: 'Our Agent',
            type: 'item',
            icon:'feather icon-user-plus',
            url: 'setting/ouragent'
          },
          {
            id: 'agentcomission',
            title: 'Agent Comission Slab',
            type: 'item',
            icon:'feather icon-upload-cloud',
            url: 'setting/agentcomission'
          },
          {
            id: 'agentfee',
            title: 'Agent Fee Slab',
            type: 'item',
            icon:'feather icon-wind',
            url: 'setting/agentfee'
          },
          {
            id: 'agentbookingreport',
            title: 'Agent Booking Report',
            type: 'item',
            icon:'feather icon-wind',
            url: 'setting/agentbookingreport'
          },
          {
            id: 'agentcancellationreport',
            title: 'Agent Cancellation Report',
            type: 'item',
            icon:'feather icon-wind',
            url: 'setting/agentcancellationreport'
          },
          // {
          //   id: 'agentcommissionreport',
          //   title: 'Agent Commission Report',
          //   type: 'item',
          //   icon:'feather icon-wind',
          //   url: 'setting/agentcommissionreport'
          // },
        ]
      },
      {
        id: 'ticketinformation',
        title: 'Ticket Information',
        type: 'collapse',
        icon: 'feather icon-thermometer',
        children: [         
          {
            id: 'cancelticket',
            title: 'Cancel Ticket',
            type: 'item',
            icon:'feather icon-wind',
            url: 'ticketinformation/cancelticket'
          },
          {
            id: 'adjustticket',
            title: 'Adjust Ticket',
            type: 'item',
            icon:'feather icon-wind',
            url: 'ticketinformation/adjustticket'
          },
          {
            id: 'smsemailticket',
            title: 'Sms Email Ticket',
            type: 'item',
            icon:'feather icon-wind',
            url: 'ticketinformation/smsemailticket'
          }
        ]
      },
      
      {
        id: 'useracessmanagement',
        title: 'Role Management',
        type: 'collapse',
        icon: 'feather icon-user',
        children: [         
          {
                id: 'managerole',
                title: 'Manage Role',
                type: 'item',
                icon:'feather icon-user',
                url: 'useracessmanagement/managerole'
          },  
          {
            id: 'managepermission',
            title: 'Manage Permission',
            type: 'item',
            icon:'feather icon-user',
            url: 'useracessmanagement/managepermission'
          },  
          {
            id: 'managepermissiontorole',
            title: 'Permission To Role',
            type: 'item',
            icon:'feather icon-user',
            url: 'useracessmanagement/managepermissiontorole'
          },                          
         
        ]
      },
      {
        // id: 'ticketinformation',
        title: 'Manage API Clients',
        type: 'collapse',
        icon: 'feather icon-cloud',
        children: [         
          {
            id: 'allapiclients',
            title: 'All API Client',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'manageapiclients/allapiclients'
          },
          {
            id: 'apiclientwalletrequest',
            title: 'API Client Wallet Request',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'manageapiclients/apiclientwalletrequest'
          },
          {
            id: 'apclientwalletbalance',
            title: 'API Client Wallet Balance',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'manageapiclients/apclientwalletbalance'
          },
          {
            id: 'apiclientcommissionslab',
            title: 'API Client CommissionSlab',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'manageapiclients/apiclientcommissionslab'
          },
          {
            id: 'apibookingstickets',
            title: 'API Bookings Tickets',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'manageapiclients/apibookingstickets'
          },
          {
            id: 'apicanceltickets',
            title: 'API Cancel Tickets',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'manageapiclients/apicanceltickets'
          },
          {
            id: 'apipnrdisputes',
            title: 'API Pnr Disputes',
            type: 'item',
            icon:'feather icon-pie-chart',
            url: 'manageapiclients/apipnrdisputes'
          },
                
        ]
      },

    ]
  }
];

const AssociationNavItems = [
  {
    id: 'odbus',
    title: '',
    //translate: 'NAV.ODBUS',
    type: 'group',
    icon: 'feather icon-home',
    children: [
      {
        id: 'dashboards',
        title: 'Dashboards',
        //translate: 'NAV.DASHBOARDS',
        type: 'item',
        icon: 'feather icon-home',
        url: 'dashboard/landing'
      },
      {
        id: 'busmanagement',
        title: 'Bus Management',
        //translate: 'NAV.BUSMANAGEMENT',
        type: 'collapse',
        icon: 'feather icon-tv',
        children: [
          {
            id: 'managelocation',
            title: 'Location',
            type: 'item',
            icon: 'feather icon-map-pin',
            url: 'busmanagement/managelocation'
          },
          {
            id: 'BoardingDropping',
            title: 'Boarding/Dropping',
            type: 'item',
            icon:'feather icon-minimize-2',
            url: 'busmanagement/BoardingDropping'
          },
          {
            id: 'manageus',
            title: 'Bus',
            type: 'item',
            icon:'feather icon-gitlab',
            url: 'busmanagement/managebus'
          },
          {
            id: 'coupon',
            title: 'Coupon',
            type: 'item',
            icon:'feather icon-tag',
            url: 'busmanagement/coupon'
          },
          {
            id: 'gallery',
            title: 'Gallery',
            type: 'item',
            icon:'feather icon-image',
            url: 'busmanagement/busgallery'
          },
          {
            id: 'seatfare',
            title: 'Seat Fare',
            type: 'item',
            icon:'feather icon-hash',
            url: 'busmanagement/seatfare'
          },


         

          {
            id: 'SeatLayout ',
            title: 'Seat Layout',
            type: 'item',
            icon:'feather icon-server',
            url: 'busmanagement/SeatLayout'
          },
          {
            id: 'CancellationSlab',
            title: 'Cancellation Slab',
            type: 'item',
            icon:'feather icon-sidebar',
            url: 'busmanagement/cancellationslab'
          },
          {
            id: 'BusOperator',
            title: 'Bus Operator',
            type: 'item',
            icon:'feather icon-sun',
            url: 'busmanagement/busoperator'
          },
          {
            id: 'BusSchedule',
            title: 'Bus Schedule',
            type: 'item',
            icon:'feather icon-twitter',
            url: 'busmanagement/busschedule'
          },
          // {
          //   id: 'Settings',
          //   title: 'Fare Setting',
          //   type: 'item',
          //   url: 'busmanagement/settings'
          // },
          {
            id: 'Offers',
            title: 'Offers',
            type: 'item',
            icon:'feather icon-watch',
            url: 'busmanagement/offers'
          },
          {
            id: 'BusSequence',
            title: 'Bus Sequence',
            type: 'item',
            icon:'feather icon-sliders',
            url: 'busmanagement/BusSequence'
          }
            // ,
            // {
            //   id   : 'formValidation',
            //   title: 'Demo Items',
            //   type : 'item',
            //   url  : 'busmanagement/formValidation'
            // }

        ]
      },
      {
        id: 'bookingmanagement',
        title: 'Booking Management',
        //translate: 'NAV.BOOKINGMANAGEMENT',
        type: 'collapse',
        icon: 'feather icon-gitlab',
        children: [
          {
            id: 'ticketfareslab',
            title: 'Ticket Fare Slab',
            type: 'item',
            icon:'feather icon-wifi-off',
            url: 'bookingmanagement/ticketfareslab'
          },
          {
            id: 'BusCancellation',
            title: 'Bus Cancellation',
            type: 'item',
            icon:'feather icon-wifi-off',
            url: 'bookingmanagement/buscancellation'
          },

          {
            id: 'seatBlock',
            title: 'Seat Block',
            type: 'item',
            icon:'feather icon-slash',
            url: 'bookingmanagement/seatblock'
          },
          {
            id: 'seatopen',
            title: 'Seat Open',
            type: 'item',
            icon:'feather icon-shield',
            url: 'bookingmanagement/seatopen'
          },
          {
            id: 'bookingseized',
            title: 'Booking Seized',
            type: 'item',
            icon:'feather icon-command',
            url: 'bookingmanagement/bookingseized'
          },
          {
            id: 'specialfare',
            title: 'Special Fare',
            type: 'item',
            icon:'feather icon-umbrella',
            url: 'bookingmanagement/specialfare'
          },
          {
            id: 'ownerfare',
            title: 'Owner Fare',
            type: 'item',
            icon:'feather icon-trending-up',
            url: 'bookingmanagement/ownerfare'
          },
          {
            id: 'festivalfare',
            title: 'Festival Fare',
            type: 'item',
            icon:'feather icon-trending-up',
            url: 'bookingmanagement/festivalfare'
          },
          {
            id: 'ownerpayment',
            title: 'Owner Payment',
            type: 'item',
            icon:'feather icon-user-check',
            url: 'bookingmanagement/ownerpayment'
          },
          //   {
          //       id   : 'CancellationSlab',
          //       title: 'Cancellation Slab',
          //       type : 'item',
          //       url  : 'busmanagement/CancellationSlab'
          //   }
        ]
      },
      {
        id: 'reports',
        title: 'Reports',
        // translate: 'NAV.REPORTS',
        type: 'collapse',
        icon: 'feather icon-file-text',
        children: [
            {
              id: 'assignagentreport',
              title: 'Assign Agent Report',
              type: 'item',
              icon:'feather icon-loader',
              url: 'reports/assignagentreport'
            },
            {
              id: 'assignbusreport',
              title: 'Assign Bus Report',
              type: 'item',
              icon:'feather icon-briefcase',
              url: 'reports/assignbusreport'
            },
            {
              id: 'assignoperatorreport',
              title: 'Assign Operator Report',
              type: 'item',
              icon:'feather icon-aperture',
              url: 'reports/assignoperatorreport'
            },
          // {
          //   id: 'agentwalletrequest',
          //   title: 'Agent Wallet Request',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/agentwalletrequest'
          // },
          // {
          //   id: 'pushnotification',
          //   title: 'Push Notification',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/pushnotification'
          // },
          // {
          //   id: 'seatopenreport',
          //   title: 'Seat Open Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/seatopenReport'
          // },
          // {
          //   id: 'extraseatopenreport',
          //   title: 'Extra Seat Open Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/extraseatopenReport'
          // },
          // {
          //   id: 'completereport',
          //   title: 'Complete Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/completeReport'
          // },
          // {
          //   id: 'seatblockreport',
          //   title: 'Seat Block Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/seatblockReport'
          // },
          // {
          //   id: 'cancleticketsReport',
          //   title: 'Cancel Tickets Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/cancleticketsReport'
          // },
          // {
          //   id: 'failedtransactionreport',
          //   title: 'Failed Transaction Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/failedtransactionreport'
          // },
          // {
          //   id: 'buscancellationreport',
          //   title: 'Bus Cancellation Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/buscancellationreport'
          // },
          // {
          //   id: 'ownerpaymentreport',
          //   title: 'Owner Payment Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/ownerpaymentreport'
          // },
          // {
          //   id   : 'cleartransactionreport',
          //   title: 'Clear Transaction Tickets Report',
          //   type : 'item',
          //   url  : 'reports/cleartransactionreport'
          // },
          // {
          //   id: 'contactreport',
          //   title: 'Contact Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/contactreport'
          // },
          // {
          //   id: 'couponuseduserreport',
          //   title: 'Coupon Used User Report',
          //   type: 'item',
          //   icon:'feather icon-pie-chart',
          //   url: 'reports/couponuseduserreport'
          // },
        ]
      },
      {
        id: 'setting',
        title: 'Website CMS Setting',
        type: 'collapse',
        icon: 'feather icon-layers',
        children: [
          {
            id: 'pagecontent',
            title: 'Page Content',
            type: 'item',
            icon:'feather icon-github',
            url: 'setting/pagecontent'
          }, 
          {
            id: 'socialmedia',
            title: 'Social Media',
            type: 'item',
            icon:'feather icon-award',
            url: 'setting/socialmedia'
          },
          {
            id: 'userreview',
            title: 'User Review',
            type: 'item',
            icon:'feather icon-message-circle',
            url: 'setting/userreview'
          },
          {
            id: 'testimonial',
            title: 'Testimonial',
            type: 'item',
            icon:'feather icon-mail',
            url: 'setting/testimonial'
          },
          {
            id: 'bannermanagement',
            title: 'Banner Management',
            type: 'item',
            icon:'feather icon-package',
            url: 'setting/bannermanagement'
          },
          {
            id: 'seosetting',
            title: 'SEO Setting',
            type: 'item',
            icon:'feather icon-link',
            url: 'setting/seosetting'
          },
          {
            id: 'specialslider',
            title: 'Special Slider',
            type: 'item',
            icon:'feather icon-speaker',
            url: 'setting/specialslider'
          },
          {
            id: 'mastersetting',
            title: 'Master Setting',
            type: 'item',
            icon:'icon feather icon-target',
            url: 'setting/mastersetting'
          }
        ]
      },

    ]
  }
];

@Injectable()
export class NavigationItem {
  public get() {
    var ROLE_ID = localStorage.getItem("ROLE_ID");
    if(ROLE_ID=="1")
    {
      return NavigationItems;
    }
    else if(ROLE_ID=="3")
    {
      return AgentItems;
    }
    else if(ROLE_ID=="4")
    {
      return OperatorItems;
    }
    else if(ROLE_ID=="5")
    {
      return AssociationNavItems;
    }
    
  }
}

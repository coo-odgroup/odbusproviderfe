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
        icon: 'all_out',
        children: [
          {
            id: 'managelocation',
            title: 'Location',
            type: 'item',
            url: 'busmanagement/managelocation'
          },
          {
            id: 'BoardingDropping',
            title: 'Boarding/Dropping',
            type: 'item',
            url: 'busmanagement/BoardingDropping'
          },
          {
            id: 'manageus',
            title: 'Bus',
            type: 'item',
            url: 'busmanagement/managebus'
          },
          {
            id: 'coupon',
            title: 'Coupon',
            type: 'item',
            url: 'busmanagement/coupon'
          },
          {
            id: 'gallery',
            title: 'Gallery',
            type: 'item',
            url: 'busmanagement/busgallery'
          },
          {
            id: 'seatfare',
            title: 'Seat Fare',
            type: 'item',
            url: 'busmanagement/seatfare'
          },


          {
            id: 'bustype',
            title: 'Bus Type',
            type: 'item',
            url: 'busmanagement/bustype'
          },
          {
            id: 'safety',
            title: 'Safety',
            type: 'item',
            url: 'busmanagement/safety'
          },
          {
            id: 'seatingtype',
            title: 'Seating Type',
            type: 'item',
            url: 'busmanagement/seatingtype'
          },
          //   {
          //       id   : 'BusAmenities',
          //       title: 'Bus Amenities',
          //       type : 'item',
          //       url  : 'busmanagement/busAmenities'
          //   },
          {
            id: 'Amenities',
            title: 'Amenities',
            type: 'item',
            url: 'busmanagement/amenities'
          },

          {
            id: 'SeatLayout ',
            title: 'Seat Layout',
            type: 'item',
            url: 'busmanagement/SeatLayout'
          },
          {
            id: 'CancellationSlab',
            title: 'Cancellation Slab',
            type: 'item',
            url: 'busmanagement/cancellationslab'
          },
          {
            id: 'BusOperator',
            title: 'Bus Operator',
            type: 'item',
            url: 'busmanagement/busoperator'
          },
          {
            id: 'BusSchedule',
            title: 'Bus Schedule',
            type: 'item',
            url: 'busmanagement/busschedule'
          },
          {
            id: 'Settings',
            title: 'Fare Setting',
            type: 'item',
            url: 'busmanagement/settings'
          },
          {
            id: 'Offers',
            title: 'Offers',
            type: 'item',
            url: 'busmanagement/offers'
          },
          {
            id: 'BusSequence',
            title: 'Bus Sequence',
            type: 'item',
            url: 'busmanagement/BusSequence'
          }
          //   ,
          //   {
          //     id   : 'formValidation',
          //     title: 'Form Validation',
          //     type : 'item',
          //     url  : 'busmanagement/formValidation'
          //   }

        ]
      },
      {
        id: 'bookingmanagement',
        title: 'Bookig Management',
        //translate: 'NAV.BOOKINGMANAGEMENT',
        type: 'collapse',
        icon: 'add_shopping_cart',
        children: [
          {
            id: 'BusCancellation',
            title: 'Bus Cancellation',
            type: 'item',
            url: 'bookingmanagement/buscancellation'
          },

          {
            id: 'seatBlock',
            title: 'seat  Block',
            type: 'item',
            url: 'bookingmanagement/seatblock'
          },
          {
            id: 'seatopen',
            title: 'Seat Open',
            type: 'item',
            url: 'bookingmanagement/seatopen'
          },
          {
            id: 'bookingseized',
            title: 'Booking Seized',
            type: 'item',
            url: 'bookingmanagement/bookingseized'
          },
          {
            id: 'specialfare',
            title: 'SpecialFare',
            type: 'item',
            url: 'bookingmanagement/specialfare'
          },
          {
            id: 'ownerfare',
            title: 'Owener Fare',
            type: 'item',
            url: 'bookingmanagement/ownerfare'
          },
          {
            id: 'festivalfare',
            title: 'Festival Fare',
            type: 'item',
            url: 'bookingmanagement/festivalfare'
          },
          {
            id: 'ownerpayment',
            title: 'Owner Payment',
            type: 'item',
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
        icon: 'add_shopping_cart',
        children: [
          //   {
          //     id   : 'routes',
          //     title: 'Routes Report',
          //     type : 'item',
          //     url  : 'reports/routes'
          // },
          // {
          //     id   : 'ticket',
          //     title: 'Ticket',
          //     type : 'item',
          //     url  : 'reports/ticket'
          // },
          {
            id: 'seatopenreport',
            title: 'Seat Open Report',
            type: 'item',
            url: 'reports/seatopenReport'
          },
          {
            id: 'extraseatopenreport',
            title: 'Extra Seat Open Report',
            type: 'item',
            url: 'reports/extraseatopenReport'
          },
          {
            id: 'completereport',
            title: 'Complete Report',
            type: 'item',
            url: 'reports/completeReport'
          },
          {
            id: 'seatblockreport',
            title: 'Seat Block Report',
            type: 'item',
            url: 'reports/seatblockReport'
          },
          {
            id: 'cancleticketsReport',
            title: 'Cancel Tickets Report',
            type: 'item',
            url: 'reports/cancleticketsReport'
          },
          {
            id: 'failedtransactionreport',
            title: 'Failed Transaction Report',
            type: 'item',
            url: 'reports/failedtransactionreport'
          },
          {
            id: 'buscancellationreport',
            title: 'Bus Cancellation Report',
            type: 'item',
            url: 'reports/buscancellationreport'
          },
          {
            id: 'ownerpaymentreport',
            title: 'Owner Payment Report',
            type: 'item',
            url: 'reports/ownerpaymentreport'
          },
          // {
          //   id   : 'cleartransactionreport',
          //   title: 'Clear Transaction Tickets Report',
          //   type : 'item',
          //   url  : 'reports/cleartransactionreport'
          // },
          {
            id: 'couponuseduserreport',
            title: 'Coupon Used User Report',
            type: 'item',
            url: 'reports/couponuseduserreport'
          },
          // {
          //     id   : 'seat',
          //     title: 'Seat',
          //     type : 'item',
          //     url  : 'reports/seat'
          // },
          // {
          //     id   : 'specialfare',
          //     title: 'SpecialFare',
          //     type : 'item',
          //     url  : 'reports/specialfare'
          // },
          // {
          //     id   : 'Bus',
          //     title: 'Bus',
          //     type : 'item',
          //     url  : 'reports/bus'
          // },
          // {
          //     id   : 'trasaction',
          //     title: 'Trasaction',
          //     type : 'item',
          //     url  : 'reports/trasaction'
          // },
          // {
          //     id   : 'owener ',
          //     title: 'Owner',
          //     type : 'item',
          //     url  : 'reports/Owner'
          // }

        ]
      },
      {
        id: 'setting',
        title: 'Setting',
        type: 'collapse',
        icon: 'add_shopping_cart',
        children: [
          {
            id: 'pagecontent',
            title: 'Page Content',
            type: 'item',
            url: 'setting/pagecontent'
          }, 
          {
            id: 'socialmedia',
            title: 'Social Media',
            type: 'item',
            url: 'setting/socialmedia'
          },
          {
            id: 'testimonial',
            title: 'Testimonial',
            type: 'item',
            url: 'setting/testimonial'
          },
          {
            id: 'bannermanagement',
            title: 'Banner Management',
            type: 'item',
            url: 'setting/bannermanagement'
          },
          {
            id: 'seosetting',
            title: 'SEO Setting',
            type: 'item',
            url: 'setting/seosetting'
          },
          {
            id: 'specialslider',
            title: 'Special Slider',
            type: 'item',
            url: 'setting/specialslider'
          },
          {
            id: 'mastersetting',
            title: 'Master Setting',
            type: 'item',
            url: 'setting/mastersetting'
          },
        ]
      },
    ]
  }
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}

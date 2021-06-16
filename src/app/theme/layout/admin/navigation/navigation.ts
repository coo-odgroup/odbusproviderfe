import {Injectable} from '@angular/core';

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
      id       : 'odbus',
      title    : '',
      //translate: 'NAV.ODBUS',
      type     : 'group',
      icon: 'feather icon-home',
      children : [
          {
              id       : 'dashboards',
              title    : 'Dashboards',
              //translate: 'NAV.DASHBOARDS',
              type     : 'item',
              icon: 'feather icon-home',
              url      : 'dashboard/landing'
          },
          {
              id       : 'busmanagement',
              title    : 'Bus Management',
              //translate: 'NAV.BUSMANAGEMENT',
              type     : 'collapse',
              icon     : 'all_out',
              children : [
                {
                    id   : 'managelocation',
                    title: 'Location',
                    type : 'item',
                    url  : 'busmanagement/managelocation'
                },
                {
                    id   : 'BoardingDropping',
                    title: 'Boarding/Dropping',
                    type : 'item',
                    url  : 'busmanagement/BoardingDropping'
                },
                  {
                      id   : 'manageus',
                      title: 'Bus',
                      type : 'item',
                      url  : 'busmanagement/managebus'
                  },
                  {
                    id   : 'gallery',
                    title: 'Gallery',
                    type : 'item',
                    url  : 'busmanagement/busgallery'
                  },
                  {
                    id   : 'seatfare',
                    title: 'Seat Fare',
                    type : 'item',
                    url  : 'busmanagement/seatfare'
                  },
                  {
                    id   : 'busWizard',
                    title: 'Buswizard',
                    type : 'item',
                    url  : 'busmanagement/busWizard'
                 },
                 
                  {
                      id   : 'bustype',
                      title: 'Bus Type',
                      type : 'item',
                      url  : 'busmanagement/bustype'
                  },
                  {
                    id   : 'safety',
                    title: 'Safety',
                    type : 'item',
                    url  : 'busmanagement/safety'
                  },
                  {
                      id   : 'seatingtype',
                      title: 'Seating Type',
                      type : 'item',
                      url  : 'busmanagement/seatingtype'
                  },
                //   {
                //       id   : 'BusAmenities',
                //       title: 'Bus Amenities',
                //       type : 'item',
                //       url  : 'busmanagement/busAmenities'
                //   },
                  {
                      id   : 'Amenities',
                      title: 'Amenities',
                      type : 'item',
                      url  : 'busmanagement/amenities'
                  },
                  
                  {
                      id   : 'SeatLayout ',
                      title: 'Seat Layout',
                      type : 'item',
                      url  : 'busmanagement/SeatLayout'
                  },
                  {
                      id   : 'CancellationSlab',
                      title: 'Cancellation Slab',
                      type : 'item',
                      url  : 'busmanagement/cancellationslab'
                  },
                  {
                      id   : 'BusOperator',
                      title: 'Bus Operator',
                      type : 'item',
                      url  : 'busmanagement/busoperator'
                  },
                  {
                    id   : 'BusSchedule',
                    title: 'Bus Schedule',
                    type : 'item',
                    url  : 'busmanagement/busschedule'
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
              id       : 'bookingmanagement',
              title    : 'Bookig Management',
              //translate: 'NAV.BOOKINGMANAGEMENT',
              type     : 'collapse',
              icon     : 'add_shopping_cart',
              children : [
                  {
                      id   : 'BusCancellation',
                      title: 'Bus Cancellation',
                      type : 'item',
                      url  : 'bookingmanagement/buscancellation'
                  },
                  {
                      id   : 'seatBlock',
                      title: 'seat  Block',
                      type : 'item',
                      url  : 'bookingmanagement/seatBlock'
                  },
                  {
                      id   : 'seatopen',
                      title: 'Seat Open',
                      type : 'item',
                      url  : 'bookingmanagement/seatopen'
                  },
                  {
                      id   : 'specialfare',
                      title: 'SpecialFare',
                      type : 'item',
                      url  : 'bookingmanagement/specialfare'
                  },
                  {
                      id   : 'ownerfare',
                      title: 'Owener Fare',
                      type : 'item',
                      url  : 'bookingmanagement/ownerfare'
                  },
                  {
                      id   : 'festivalfare',
                      title: 'Festival Fare',
                      type : 'item',
                      url  : 'bookingmanagement/festivalfare'
                  },
                  {
                      id   : 'SeatLayout ',
                      title: 'Seat Layout',
                      type : 'item',
                      url  : 'busmanagement/SeatLayout'
                  },
                  {
                      id   : 'BusSequence',
                      title: 'Bus Sequence',
                      type : 'item',
                      url  : 'busmanagement/BusSequence'
                  },
                  {
                      id   : 'CancellationSlab',
                      title: 'Cancellation Slab',
                      type : 'item',
                      url  : 'busmanagement/CancellationSlab'
                  }
              ]
          },

      {
          id       : 'reports',
          title    : 'Reports',
         // translate: 'NAV.REPORTS',
          type     : 'collapse',
          icon     : 'add_shopping_cart',
          children : [
              {
                  id   : 'routes',
                  title: 'Routes Routes Report',
                  type : 'item',
                  url  : 'reports/routes'
              },
              {
                  id   : 'ticket',
                  title: 'Ticket',
                  type : 'item',
                  url  : 'reports/ticket'
              },
              {
                  id   : 'seat',
                  title: 'Seat',
                  type : 'item',
                  url  : 'reports/seat'
              },
              {
                  id   : 'specialfare',
                  title: 'SpecialFare',
                  type : 'item',
                  url  : 'reports/specialfare'
              },
              {
                  id   : 'Bus',
                  title: 'Bus',
                  type : 'item',
                  url  : 'reports/bus'
              },
              {
                  id   : 'trasaction',
                  title: 'Trasaction',
                  type : 'item',
                  url  : 'reports/trasaction'
              },
              {
                  id   : 'owener ',
                  title: 'Owner',
                  type : 'item',
                  url  : 'reports/Owner'
              }
          
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

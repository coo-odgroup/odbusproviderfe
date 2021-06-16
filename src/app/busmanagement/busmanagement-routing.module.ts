import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'bustype',
        loadChildren: () => import('./bustype/bustype.module').then(module => module.BusTypedModule)
      },
      {
        path: 'cancellationslab',
        loadChildren: () => import('./cancellationslab/cancellationslab.module').then(module => module.CancellationSlabedModule)
      },
      {
        path: 'managebus',
        loadChildren: () => import('./bus/bus.module').then(module => module.BusModule)
      },
      {
        path: 'busgallery',
        loadChildren: () => import('./busgallery/busgallery.module').then(module => module.BusGalleryModule)
      },
      {
        path: 'BoardingDropping',
        loadChildren: () => import('./boardingdroping/boardingdropping.module').then(module => module.BoardingDroppingModule)
      },
      
      {
        path:'amenities',
        loadChildren: () => import('./amenities/amenities.module').then(module => module.AmenitiesModule)
      }
      ,
      {
        path:'busAmenities',
        loadChildren: () => import('./busamenities/busamenities.module').then(module => module.BusAmenitiesModule)
      },
      {
        path:'seatingtype',
        loadChildren: () => import('./seatingtype/seatingtype.module').then(module => module.SeatingTypeModule)
      },
      {
        path:'managelocation',
        loadChildren: () => import('./location/location.module').then(module => module.LocationModule)
      },
      {
        path:'SeatLayout',
        loadChildren: () => import('./seatlayout/seatlayout.module').then(module => module.SeatLayoutdModule)
      },
      {
        path:'BusSequence',
        loadChildren: () => import('./bussequence/bussequence.module').then(module => module.BusSequenceModule)
      },
      {
        path:'busoperator',
        loadChildren: () => import('./busoperator/busoprator.module').then(module => module.BusOperatorModule)
      },
      {
        path:'busschedule',
        loadChildren: () => import('./busschedule/busschedule.module').then(module => module.BusScheduleModule)
      },
      {
        path:'formValidation',
        loadChildren: () => import('./formValidation/formValidation.module').then(module => module.FormValidatioModule)
      },
      {
        path:'safety',
        loadChildren: () => import('./safety/safety.module').then(module => module.SafetyModule)
      },
      {
        path:'test',
        loadChildren: () => import('./test/test.module').then(module => module.TestModule)
      },
      {
        path:'seatfare',
        loadChildren: () => import('./seatfare/seatfare.module').then(module => module.SeatFareModule)
      },
      {
        path:'busWizard',
        loadChildren: () => import('./buswizard/buswizard.module').then(module => module.BuswizardModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusManagementRoutingModule { }

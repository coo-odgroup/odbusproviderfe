import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'buscancellation',
        loadChildren: () => import('./buscancellation/buscancellation.module').then(module => module.BusCancellationModule)
      },
      {
        path: 'specialfare',
        loadChildren: () => import('./specialfare/specialfare.module').then(module => module.SpecialFareModule)
      },
      {
        path: 'ownerfare',
        loadChildren: () => import('./ownerfare/ownerfare.module').then(module => module.OwnerFareModule)
      },
      {
        path: 'festivalfare',
        loadChildren: () => import('./festivalfare/festivalfare.module').then(module => module.FestivalFareModule)
      },      
	  {
        path: 'seatopen',
        loadChildren: () => import('./seatopen/seatopen.module').then(module => module.SeatOpenModule)
      }, 
      {
        path: 'seatblock',
        loadChildren: () => import('./seatblock/seatblock.module').then(module => module.SeatBlockModule)
      },  
      {
        path: 'bookingseized',
        loadChildren: () => import('./bookingseized/bookingseized.module').then(module => module.BookingseizedModule)
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingManagementRoutingModule { }

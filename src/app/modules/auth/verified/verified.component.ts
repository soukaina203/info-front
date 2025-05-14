import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verified',
  standalone: true,
  imports: [CommonModule,NgIf],
  templateUrl: './verified.component.html',
  styleUrl: './verified.component.scss'
})
export class VerifiedComponent {
private route = inject (ActivatedRoute)
isVerified : boolean =false
token = this.route.snapshot.paramMap.get('token');

ngOnInit(){
let localToken=localStorage.getItem("token")
if (localToken==this.token) {
    this.isVerified=true
}

// add the logic for staying for 2 seconds then be redirected to the dashboard + also add to send to the back to make the status true
}
}

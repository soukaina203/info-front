import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
    import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatModule } from 'app/mat.module';

@Component({
  selector: 'app-poppup',
  standalone: true,
  imports: [CommonModule , MatModule],
  templateUrl: './poppup.component.html',
  styleUrl: './poppup.component.scss'
})
export class PoppupComponent {



 constructor(
    public dialogRef: MatDialogRef<PoppupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      message: string;
      color?: string;
      textColor?: string;
    }
  ) {}

}

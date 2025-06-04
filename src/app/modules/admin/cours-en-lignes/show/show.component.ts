import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Class } from 'app/models/Class';
import { UowService } from 'app/services/uow.service';
import { environment } from 'environment/environment';

@Component({
    selector: 'app-show',
    standalone: true,
    imports: [CommonModule, RouterLink],

    templateUrl: './show.component.html',
    styleUrl: './show.component.scss'
})
export class ShowComponent {
    // dependencies
    private route = inject(ActivatedRoute)
    private uow = inject(UowService)
    private sanitizer= inject( DomSanitizer)


    environment = environment.url
    Url: SafeUrl

    //variables
    id: string
    class: Class

    // Functions
    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.uow.classes.getOne(parseInt(this.id)).subscribe((res:{data:Class} ) => {
            this.class = res.data
        this.Url = this.sanitizer.bypassSecurityTrustUrl(`${this.environment}/classes/${this.class.picture}`)

        })
    }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-details-field-area',
  templateUrl: './details-field-area.component.html',
  styleUrls: ['./details-field-area.component.scss'],
})
export class DetailsFieldAreaComponent {
  detailField: any[] = [];
  constructor(
    private categoryService: CategoryService,
    private params: ActivatedRoute
  ) {
    this.getIdCategory();
  }
  getIdCategory() {
    // getCategoryById
    var id = this.params.snapshot.params['id'];

    this.categoryService.getCategoryById(id).subscribe((category) => {
      console.log(category, 'ccc');
    });
  }
}

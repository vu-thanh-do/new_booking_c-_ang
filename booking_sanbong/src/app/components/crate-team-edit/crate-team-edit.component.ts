import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category/category.service';
import { TeamserviceService } from 'src/app/services/team/teamservice.service';

@Component({
  selector: 'app-crate-team-edit',
  templateUrl: './crate-team-edit.component.html',
  styleUrls: ['./crate-team-edit.component.scss'],
})
export class CrateTeamEditComponent {
  addForm = this.builder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    level: ['', [Validators.required]],
    age: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private teamService: TeamserviceService
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.getCategoryById(id!);
    });
  }
  getCategoryById(id: string) {
    this.teamService.getIdTeam(id).subscribe((category) => {
      console.log(category, 'category');
      this.addForm.patchValue({
        name: category.data.name,
        description: category.data.description,
        phone: category.data.phone,
        age: category.data.age,
        level: category.data.level,
      });
    });
  }
  handleSubmitEditCategoryForm() {
    if (this.addForm.invalid) return;
    const id = this.route.snapshot.paramMap.get('id');
    const category = {
      id: id,
      name: this.addForm.value.name || '',
      description: this.addForm.value.description || '',
      phone: this.addForm.value.phone || '',
      age: this.addForm.value.age || '',
      level: this.addForm.value.level || '',
    };
    this.teamService.editTeamByUser(category).subscribe(() => {
      this.toastr.success('Update category successfully!');
      this.router.navigate(['/create-team']);
    });
  }
}

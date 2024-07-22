import { Component, ViewChild } from '@angular/core';
import { PopupComponent } from '../../alertas/componentes/popup/popup.component';
import { Pager } from '../../compartido/modelos/Pager';
import { CategoryModel } from '../../models/category.model';
import { Filters } from '../../compartido/modelos/Filters';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Pagination } from '../../compartido/modelos/Pagination';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  @ViewChild('popup') popup!: PopupComponent;
  pager: Pager<Filters>;
  categories: CategoryModel[] = [];
  term: string = '';
  showBlankRow: boolean = false;
  newCategory: any = {};
  form: FormGroup;
  constructor(private service: CategoryService,private route: Router) {
    this.pager = new Pager<Filters>(this.getCategories);
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.pager.begin(1, 5);
  }

  getCategories = (page: number, limit: number, filters?: Filters) => {
    return new Observable<Pagination>((subscribe) => {
      this.service.getcategories(page, limit, filters).subscribe({
        next: (resp) => {
          this.categories = resp.categories;
          subscribe.next(resp.pagination);
        },
      });
    });
  };

  showNew(){
    this.newCategory = {}; 
    this.showBlankRow = true;
  }

  create() {
    this.service
      .setCategory(this.newCategory)
      .subscribe({
        next: () => {
           this.createdCategory()
           this.showBlankRow = false; 
           this.newCategory = {}; 
        },
        error: () => {
           this.popup.abrirPopupFallido("Error creating item", "Try again later.")
        },
      });
  }

  update(category:CategoryModel) {
    this.service
      .updateCategory(category)
      .subscribe({
        next: () => {           
           this.updatedCategory()
           category.editing=false;
        },
        error: () => {
           this.popup.abrirPopupFallido("Error updating category", "Try again later.")
        },
      });
  }

  closeCreate() {
    this.showBlankRow = false;
    this.newCategory = {};
  }

  closeUpdate(category:CategoryModel) {
    category.editing = false
    this.pager.refrescar();
  }

  openCategoriess(groupId: number) {
    if (groupId) {
      this.route.navigate(['/dashboard/items-group/items', groupId]);
    }
  }

  deleteCategory(id?: number) {
    console.log(id);
  }

  updateFilters() {
    this.pager.filter({
      term: this.term,
    });
  }

  clearFilters() {
    this.term = '';
    this.pager.filter({});
  }

  createdCategory() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Category created successfully.');
  }
  updatedCategory() {
    this.pager.refrescar();
    this.popup.abrirPopupExitoso('Category updated successfully.');
  }

 
}

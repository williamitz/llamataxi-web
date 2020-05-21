import { Component, OnInit } from '@angular/core';
import { NavChildrenModel } from 'src/app/models/navChildren.model';
import { INavChildren } from 'src/app/interfaces/navChildren.interface';
import { NavChildrenService } from 'src/app/services/navChildren.service';
import { PagerService } from 'src/app/services/pager.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nav-children',
  templateUrl: './nav-children.component.html',
  styleUrls: ['./nav-children.component.css'],
})
export class NavChildrenComponent implements OnInit {
  bodyNavChildren: NavChildrenModel;
  dataNavChildren: INavChildren[] = [];
  dataNavFather: any[];
  titleModal = 'Nuevo menù hijo';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  showInactive = false;

  qFather = '';
  qChildren = '';
  qUrl = '';

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  loadData = false;
  loading = false;

  constructor(
    private NavChildrenSvc: NavChildrenService,
    private pagerSvc: PagerService
  ) {}

  ngOnInit() {
    this.bodyNavChildren = new NavChildrenModel();
    this.onGetNavChildren(1);
    this.onGetAllNavFather();
  }

  onGetAllNavFather() {
    this.NavChildrenSvc.onGetListAllNavFather().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataNavFather = res.data;
    });
  }
  onGetNavChildren(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.NavChildrenSvc.onGetListNavChildren( page, this.qFather, this.qChildren, this.qUrl, this.showInactive ).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.dataNavChildren = res.data;
      this.pagination = this.pagerSvc.getPager(res.total, page, 10);

      if (this.pagination.totalPages > 0) {
        const start = (this.pagination.currentPage - 1) * 10 + 1;
        const vend =
          (this.pagination.currentPage - 1) * 10 + this.dataNavChildren.length;
        this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
      }
    });
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {

        this.NavChildrenSvc.onAddNavChildren(this.bodyNavChildren).subscribe(
          (res) => {
            if (!res.ok) {
              throw new Error(res.error);
            }
            this.loading = false;
            const { css, icon, msg } = this.onGetError(res.showError);

            if (res.showError !== 0) {
              this.onShowAlert('alertNavChildrenModal', css, icon, msg);
              return;
            } else {
              this.onShowAlert('alertNavChildren', css, icon, msg);
            }

            $('#btnCloseModal').trigger('click');
            this.onGetNavChildren(1);
          }
        );

        return;
      }

      this.NavChildrenSvc.onUpdateNavChildren(this.bodyNavChildren).subscribe(
        (res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);

          if (res.showError !== 0) {
            this.onShowAlert('alertNavChildrenModal', css, icon, msg);
            return;
          } else {
            this.onShowAlert('alertNavChildren', css, icon, msg);
          }

          $('#btnCloseModal').trigger('click');
          this.onGetNavChildren(1);
        }
      );
    }
  }

  onEdit(id: number) {
    const finded = this.dataNavChildren.find(
      (NavChildren) => NavChildren.pkNavChildren === id
    );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }
    this.bodyNavChildren.pkNavChildren = finded.pkNavChildren;
    this.bodyNavChildren.fkNavFather = finded.fkNavFather;
    this.bodyNavChildren.navChildrenText = finded.navChildrenText;
    this.bodyNavChildren.navChildrenPath = finded.navChildrenPath;
    this.bodyNavChildren.navChildrenIcon = finded.navChildrenIcon;
    this.bodyNavChildren.isVisible = finded.isVisible;
    this.titleModal = 'Editar Nav Children';
    this.textButton = 'Guardar cambios';

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.NavChildrenSvc.onDeleteNavChildren(this.bodyNavChildren).subscribe(
      (res) => {
        console.log('res');
        console.log(res);
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);
        const action = this.bodyNavChildren.statusRegister
          ? 'restaurado'
          : 'eliminado';
        this.onShowAlert(
          'alertNavChildren',
          css,
          icon,
          `Se ha ${action} una aplicacion con éxito`
        );

        if (res.showError !== 0) {
          this.onShowAlert('alertNavChildrenModal', css, icon, msg);
          return;
        }

        $('#btnCloseConfirm').trigger('click');
        this.onGetNavChildren(1);
      }
    );
  }

  onConfirm(id: number) {
    const finded = this.dataNavChildren.find(
      (NavChildren) => NavChildren.pkNavChildren === id
    );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyNavChildren.pkNavChildren = finded.pkNavChildren;
    this.bodyNavChildren.statusRegister = !finded.statusRegister;
    this.actionConfirm = finded.statusRegister ? 'eliminar' : 'restaurar';
  }

  onShowAlert(idAlert: string, css: string, icon: string, msg: string) {
    let html = `<div class="alert alert-${css} alert-dismissible fade show" role="alert">`;
    html += `<span class="alert-icon"><i class="fa fa-${icon}"></i></span>`;
    html += `<span class="alert-text"> ${msg} </span>`;
    html += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    html += `<span aria-hidden="true">&times;</span>`;
    html += `</button>`;
    html += `</div>`;

    $(`#${idAlert}`).html(html);
  }

  onGetError(showError: number) {
    const css = showError === 0 ? 'success' : 'danger';
    const icon = showError === 0 ? 'check' : 'exclamation-circle';
    const action = this.loadData ? 'actualizado' : 'creado';
    const arrErr =
      showError === 0
        ? [`Se ha ${action} una NavChildren con éxito`]
        : ['Error, ya existe un registro'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push('con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push('se encuentra inactivo');
    }

    return { css, icon, msg: arrErr.join(', ') };
  }

  onReset() {
    $('#frmNavChildren').trigger('reset');
    this.bodyNavChildren.onReset();
    this.titleModal = 'Nueva aplicación';
    this.textButton = 'Guardar';
    this.loadData = false;
  }
}

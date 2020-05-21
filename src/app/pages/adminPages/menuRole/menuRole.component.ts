import { Component, OnInit } from '@angular/core';
import { MenuRoleModel } from 'src/app/models/menuRole.model';
import { IMenuRole } from 'src/app/interfaces/menuRole.interface';
import { MenuRoleService } from 'src/app/services/menuRole.service';
import { PagerService } from 'src/app/services/pager.service';
import { NgForm } from '@angular/forms';
import { IRole } from '../../../interfaces/roles.interface';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-MenuRole',
  templateUrl: './menuRole.component.html',
  styleUrls: [ './menuRole.component.css' ],
})
export class MenuRoleComponent implements OnInit {
  bodyMenuRole: MenuRoleModel;
  dataMenuRole: IMenuRole[] = [];
  dataNavChildren: any[];
  titleModal = 'Nuevo Menu Role';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  showInactive = false;
  dataRole: IRole[] = [
    { code: 'WEBMASTER_ROLE', name: 'Webmaster' },
    { code: 'ADMIN_ROLE', name: 'Administrador' },
    { code: 'ATTENTION_ROLE', name: 'Atención al cliente' }
  ];

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  qNav = '';
  qRole = '';

  loadData = false;
  loading = false;

  constructor(
    private MenuRoleSvc: MenuRoleService,
    private pagerSvc: PagerService
  ) {}

  ngOnInit() {
    this.bodyMenuRole = new MenuRoleModel();
    this.onGetMenuRole(1);
    this.onGetAllNavChildren();
  }
  onGetAllNavChildren() {
    this.MenuRoleSvc.onGetListAllNavChildren().subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }
      this.dataNavChildren = res.data;
    });
  }
  onGetMenuRole(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }
    this.MenuRoleSvc.onGetListMenuRole(page, this.qNav, this.qRole, this.showInactive).subscribe(
      (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.dataMenuRole = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend =
            (this.pagination.currentPage - 1) * 10 + this.dataMenuRole.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }
      }
    );
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.MenuRoleSvc.onAddMenuRole(this.bodyMenuRole).subscribe((res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);
          if (res.showError !== 0) {
            this.onShowAlert('alertMenuRoleModal', css, icon, msg);
            return;
          } else {
            this.onShowAlert('alertMenuRole', css, icon, msg);
          }

          $('#btnCloseModal').trigger('click');
          this.onGetMenuRole(1);
        });

        return;
      }

      this.MenuRoleSvc.onUpdateMenuRole(this.bodyMenuRole).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert('alertMenuRoleModal', css, icon, msg);
          return;
        } else {
          this.onShowAlert('alertMenuRole', css, icon, msg);
        }

        $('#btnCloseModal').trigger('click');
        this.onGetMenuRole(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataMenuRole.find(
      (MenuRole) => MenuRole.pkMenuRole === id
    );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyMenuRole.pkMenuRole = finded.pkMenuRole;
    this.bodyMenuRole.fkNavChildren = finded.fkNavChildren;
    this.bodyMenuRole.role = finded.role;

    this.titleModal = 'Editar Menu Role';
    this.textButton = 'Guardar cambios';

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.MenuRoleSvc.onDeleteMenuRole(this.bodyMenuRole).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyMenuRole.statusRegister
        ? 'restaurado'
        : 'eliminado';
      this.onShowAlert(
        'alertMenuRole',
        css,
        icon,
        `Se ha ${action} una aplicacion con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert('alertMenuRoleModal', css, icon, msg);
        return;
      }

      $('#btnCloseConfirm').trigger('click');
      this.onGetMenuRole(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataMenuRole.find(
      (MenuRole) => MenuRole.pkMenuRole === id
    );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyMenuRole.pkMenuRole = finded.pkMenuRole;
    this.bodyMenuRole.statusRegister = !finded.statusRegister;
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
        ? [`Se ha ${action} un MenuRole con éxito`]
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
    $('#frmMenuRole').trigger('reset');
    this.bodyMenuRole.onReset();
    this.titleModal = 'Nuevo MenuRole';
    this.textButton = 'Guardar';
    this.loadData = false;
  }
}

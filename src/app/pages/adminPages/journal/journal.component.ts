import { Component, OnInit, OnDestroy } from '@angular/core';
import { JournalModel } from 'src/app/models/journal.model';
import { IJournal } from 'src/app/interfaces/journal.interface';
import { JournalService } from 'src/app/services/journal.service';
import { PagerService } from 'src/app/services/pager.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-journal',
  templateUrl: './Journal.component.html',
  styleUrls: [],
})
export class JournalComponent implements OnInit, OnDestroy {

  journalSbc: Subscription;

  bodyJournal: JournalModel;
  dataJournal: IJournal[] = [];
  titleModal = 'Nuevo Jornada';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  showInactive = false;

  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage: 0,
    pages: [],
    totalPages: 0,
  };

  loadData = false;
  loading = false;

  constructor( private JournalSvc: JournalService, private pagerSvc: PagerService ) {}

  ngOnInit() {
    this.bodyJournal = new JournalModel();
    this.onGetJournal(1);
  }

  onGetJournal(page: number, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
    }

    this.journalSbc = this.JournalSvc.onGetListJournal(page, 0, this.showInactive).subscribe(
      (res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.dataJournal = res.data;
        this.pagination = this.pagerSvc.getPager(res.total, page, 10);

        if (this.pagination.totalPages > 0) {
          const start = (this.pagination.currentPage - 1) * 10 + 1;
          const vend =
            (this.pagination.currentPage - 1) * 10 + this.dataJournal.length;
          this.infoPagination = `Mostrando del ${start} al ${vend} de ${res.total} registros.`;
        }
      }
    );
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      this.loading = true;
      if (this.loadData === false) {
        this.JournalSvc.onAddJournal(this.bodyJournal).subscribe((res) => {
          if (!res.ok) {
            throw new Error(res.error);
          }

          this.loading = false;
          const { css, icon, msg } = this.onGetError(res.showError);
          if (res.showError !== 0) {
            this.onShowAlert('alertJournalModal', css, icon, msg);
            return;
          } else {
            this.onShowAlert('alertJournal', css, icon, msg);
          }

          $('#btnCloseModal').trigger('click');
          this.onGetJournal(1);
        });

        return;
      }

      this.JournalSvc.onUpdateJournal(this.bodyJournal).subscribe((res) => {
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.loading = false;
        const { css, icon, msg } = this.onGetError(res.showError);

        if (res.showError !== 0) {
          this.onShowAlert('alertJournalModal', css, icon, msg);
          return;
        } else {
          this.onShowAlert('alertJournal', css, icon, msg);
        }

        $('#btnCloseModal').trigger('click');
        this.onGetJournal(1);
      });
    }
  }

  onEdit(id: number) {
    const finded = this.dataJournal.find(
      (Journal) => Journal.pkJournal === id
    );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyJournal.pkJournal = finded.pkJournal;
    this.bodyJournal.nameJournal = finded.nameJournal;
    this.bodyJournal.codeJournal = finded.codeJournal;
    this.bodyJournal.hourStart = finded.hourStart;
    this.bodyJournal.hourEnd = finded.hourEnd;

    this.titleModal = 'Editar Jornada';
    this.textButton = 'Guardar cambios';

    this.loadData = true;
  }

  onDelete() {
    this.loading = true;

    this.JournalSvc.onDeleteJournal(this.bodyJournal).subscribe((res) => {
      if (!res.ok) {
        throw new Error(res.error);
      }

      this.loading = false;
      const { css, icon, msg } = this.onGetError(res.showError);
      const action = this.bodyJournal.statusRegister
        ? 'restaurado'
        : 'eliminado';
      this.onShowAlert(
        'alertJournal',
        css,
        icon,
        `Se ha ${action} una jornada con éxito`
      );

      if (res.showError !== 0) {
        this.onShowAlert('alertJournalModal', css, icon, msg);
        return;
      }

      $('#btnCloseConfirm').trigger('click');
      this.onGetJournal(1);
    });
  }

  onConfirm(id: number) {
    const finded = this.dataJournal.find(
      (Journal) => Journal.pkJournal === id
    );
    if (!finded) {
      console.error('No se encontro registro!!!');
      return;
    }

    this.bodyJournal.pkJournal = finded.pkJournal;
    this.bodyJournal.statusRegister = !finded.statusRegister;
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
        ? [`Se ha ${action} una jornada con éxito`]
        : ['Error, ya existe un registro'];

    // tslint:disable-next-line: no-bitwise
    if (showError & 1) {
      arrErr.push('con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 2) {
      arrErr.push('con este codigo');
    }

    // tslint:disable-next-line: no-bitwise
    if (showError & 4) {
      arrErr.push('se encuentra inactivo');
    }

    return { css, icon, msg: arrErr.join(', ') };
  }

  onReset() {
    $('#frmJournal').trigger('reset');
    this.bodyJournal.onReset();
    this.titleModal = 'Nueva jornada';
    this.textButton = 'Guardar';
    this.loadData = false;
  }

  ngOnDestroy() {

    this.journalSbc.unsubscribe();

  }

}

import { Component, OnInit } from '@angular/core';
import { CellClickedEvent, CellValueChangedEvent, EditableCallbackParams, GridApi, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { PatientDetail } from 'src/app/model/patient.model';
import { PatientService } from 'src/app/service/patient-data.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {

  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public gridColumnApi;

  columnDefs: any = [];
  rowData: any = [];

  constructor(private patientService: PatientService) {
    this.columnDefs = [
      { field: 'name', filter: true, width: 300, cellClass: "grid-cell-centered"},
      { field: 'dateOfBirth', headerName: 'Birthday', filter: 'agDateColumnFilter', filterParams: this.filterParams, width: 200
            , cellClass: "grid-cell-centered"},
      { field: 'emailId', filter: true, width: 380, cellClass: "grid-cell-centered"},
      { field: 'imageUrl', filter: true, width: 200, cellClass: "grid-cell-centered"},
      { field: 'delete', cellClass: "grid-cell-centered"},
    ];
    this.initGrid();
  }

  ngOnInit() {
  }

  async updatePatientData(column: string, data: any): Promise<boolean> {
    let patientDetailRequest = new PatientDetail(data);
    await this.patientService
      .upsertPatientData(patientDetailRequest)
      .then((response) => {
        console.log('Update respone -> ', response);
        alert('Patient record of ' + column + ' has been updated successfully');
        return true;
      })
      .catch((errors) => {
        console.log(errors);
        return false;
      });
    return false;
  }

  async deletePatientData(column: string, data: any) {
    let patientDetailRequest = new PatientDetail(data);
    await this.patientService
      .deletePatientData(patientDetailRequest)
      .then((response) => {
        console.log('Delete respone -> ', response);
        alert('Patient record of ' + column + ' has been deleted successfully');
        this.loadGridData();
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadGridData();
    this.gridApi.sizeColumnsToFit();
  }

  loadGridData() {
    this.gridApi.showLoadingOverlay();
    this.patientService
      .getAllPatientData()
      .then((response: PatientDetail[]) => {
        console.log('Grid rows -> ', response);
        // response.forEach((item) => {
        //   if(item.imageUrl.length > 0 && this.imageExists(item.imageUrl))
        //     item.imageExists = true;
        // });
        this.gridOptions.api.setRowData(response);
        this.gridApi.hideOverlay();
      }
      );
  }

  initGrid() {
    this.gridOptions = {
      defaultColDef: {
        autoHeight: true,
        wrapText: true,
        floatingFilter: true,
        cellStyle: (params) => { 
          if (params.colDef.field !== 'imageUrl') {
              return {marginTop: '33px'};
          }
        },
        editable: (params: EditableCallbackParams) => {
          if (params.colDef.field !== 'delete') {
            return true;
          }
        },
        cellRenderer: (params) => {
          if (params.colDef.field === 'delete')
            return '<i class="fa fa-trash-o" style="font-size:24px;color:red"></i>';
          else if (params.colDef.field === 'imageUrl') {
            let noImageUrl = 'https://cdn.iconscout.com/icon/free/png-256/no-image-1771002-1505134.png';
              return '<img src = "' + params.value + '" alt="" border=3 height=100 width=100'
              + ' onerror="this.onerror=null;this.src=\'' + noImageUrl + '\';" />';
          }
          return params.value;
        }
      },
      animateRows: true,
      pagination: true,
      paginationPageSize: 10,
      suppressClickEdit: false,
      suppressRowClickSelection: false,
      suppressHorizontalScroll: true,
      suppressContextMenu: true,
      enterMovesDownAfterEdit: false,
      enterMovesDown: false,
      rowData: this.rowData,
      columnDefs: this.columnDefs,
      onCellValueChanged: (event: CellValueChangedEvent) => {
        if (typeof event.newValue === "string" &&
          this.validateDataValues(event.colDef.field, event.newValue)) {
          // Update changes
          console.log('Cell value of ' + event.colDef.field + ' has changed: ' + event.oldValue + ' -> ' + event.newValue);
          event.node.data[event.colDef.field] = event.newValue;
          if (!this.updatePatientData(event.colDef.field, event.node.data))
            event.data[event.colDef.field] = event.oldValue;
        }
        else {
          // Revert changes
          event.node.data[event.colDef.field] = event.oldValue;
          event.api.refreshCells();
        }
      },
      onCellClicked: (event: CellClickedEvent) => {
        if (event.colDef.field === 'delete') {
          if (confirm('Patient record of ' + event.data.name + ' will be deleted. Confirm!')) {
            // Delete
            this.deletePatientData(event.colDef.field, event.data);
          }
        }
      }
    };
  }

  validateDataValues(type: string, newValue: string): boolean {
    switch (type) {
      case 'name': {
        if (newValue && newValue.length > 2 && newValue.length < 51)
          return true;
        else
          alert('Name is required and should be within the range of characters 3 and 50');
        break;
      }
      case 'dateOfBirth': {
        if (newValue && newValue.length > 0
          && new RegExp(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/).test(newValue))
          return true;
        else
          alert('Date of birth should be in dd/MM/yyyy format');
        break;
      }
      case 'emailId': {
        if (newValue && newValue.length > 0
          && new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(newValue))
          return true;
        else
          alert('Valid email should be entered');
        break;
      }
      case 'imageUrl': {
        if (newValue && newValue.length > 0
          && new RegExp('([a-z.]{2,6})[/\\w .-]*/?').test(newValue))
          return true;
        else
          alert('Valid Url should be entered');
        break;
      }

    }
    return false;
  }

  imageExists = (url: string) => {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    xhr.send();
    return (xhr.status !== 404);
  }

  filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split('/');
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    browserDatePicker: true,
  };

}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { environment } from 'src/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-details-booking',
  templateUrl: './details-booking.component.html',
  styleUrls: ['./details-booking.component.scss'],
})
export class DetailsBookingComponent {
  dataDetails: any = {};
  checkUserOrAdmin: boolean = false;
  priceStake: number = 0;
  urlImage: string = environment.API_URL + '/root/';
  dataToExport: any;
  constructor(
    private orderService: OrderService,
    private params: ActivatedRoute
  ) {
    this.params.queryParams.subscribe((params) => {
      const userId = params['user'];
      if (userId == 1) {
      } else {
        this.checkUserOrAdmin = false;
      }
    });
    this.handelGetDetailsBooking();
  }
  handelGetDetailsBooking() {
    var id = this.params.snapshot.params['id'];
    this.orderService.getDetailsBooking(id).subscribe((data: any) => {
      console.log(data);
      if (data.data.deposited == true) {
        this.checkUserOrAdmin = true;
      }
      this.priceStake = data.data.price / 10;
      this.dataDetails = data.data;
      this.dataToExport = {
        name: data.data.user.email,
        price: data.data.price,
        startDate: data.data.start,
        endDate: data.data.end,
        nameField: data.data.field.name,
      };
    });
  }
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      Array(this.dataToExport)
    );
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    XLSX.writeFile(workbook, `hoadon.xlsx`);
  }
}

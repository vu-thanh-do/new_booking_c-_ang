import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-details-booking',
  templateUrl: './details-booking.component.html',
  styleUrls: ['./details-booking.component.scss'],
})
export class DetailsBookingComponent {
  dataDetails: any = {};
  urlImage: string = environment.API_URL + '/root/';

  constructor(
    private orderService: OrderService,
    private params: ActivatedRoute
  ) {
    this.handelGetDetailsBooking();
  }
  handelGetDetailsBooking() {
    var id = this.params.snapshot.params['id'];
    this.orderService.getDetailsBooking(id).subscribe((data: any) => {
      console.log(data);
      this.dataDetails = data.data;
    });
  }
}

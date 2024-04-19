import { ActivatedRoute, Router } from '@angular/router';
import { IResViewComment } from 'src/app/interfaces/comment';

import { Component } from '@angular/core';
import { IPosts } from 'src/app/interfaces/Product';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductsService } from 'src/app/services/products/products.service';

import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environment';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss', './a.scss'],
})
export class ProductsDetailPageComponent {
  mailUser!: string | null;
  post!: IPosts;
  checkedTimeBook: string = '';
  checkDisabled: boolean = false;
  relatedPosts!: IPosts[];
  newDateBookingResultStart: string = '';
  newDateBookingResultEnd: string = '';
  idUserCreatePost: string = '';
  comments!: IResViewComment[];
  urlImage: string = environment.API_URL + '/root/';
  getTimeField: any[] = [];
  getTimeField2: any[] = [];
  getTimeField3: any[] = [];
  getTimeField4: any[] = [];
  serviceField: any[] = [];
  idPost!: string;
  serviceUsed: any[] = [];
  getField!: any;
  total: number = 0;
  bookingForm = this.builder.group({
    fieldId: ['', Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
    status: ['1', Validators.required],
    description: ['', Validators.required],
  });
  dataPostsRelate: any[] = [];
  constructor(
    private postService: ProductsService,
    private cateService: CategoryService,
    private router: ActivatedRoute,
    private redirect: Router,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private params: ActivatedRoute
  ) {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.idPost = id || '';
      var checkDate = new Date();
      var currentDate: any = this.formatDate(checkDate);
      var newCheck = parseInt(currentDate.split('-')[0]);
      var checkMonth = parseInt(currentDate.split('-')[1]);
      var checkDay = parseInt(currentDate.split('-')[2]);
      if (this.idPost) {
        /* get all comment by id with socket */
        console.log(id);
      }
      this.postService.getPost(id!, checkDay, checkMonth, newCheck).subscribe(
        (data) => {
          this.idUserCreatePost = data.data.userId;
          console.log(data.data.userId, 'db');
          this.total = data.data.price;
          this.post = data.data;
          this.getTimeField = data.data.fieldTimes;
          this.serviceField = data.data.services;
          this.handelGetPostsRelate(data.data.userId);
          // this.cateService
          //   .getRelatedPost(data.post.category._id)
          //   .subscribe(({ data }) => {
          //     this.relatedPosts = data.posts!;
          //   });
          console.log(this.idUserCreatePost, 'this.idUserCreatePost');
        },
        () => {
          this.toastr.error("Couldn't find this post.Please try again😥😥");
        }
      );
    });

    const newMailUSer: any = localStorage.getItem('user');
    var nextResult = JSON.parse(newMailUSer);
    this.mailUser = nextResult.email;
    this.handelGetgetField();
  }
  handleSubmitFormBooking() {
    console.log(this.bookingForm.value, 'this.bookingForm.value');
    if (
      this.newDateBookingResultStart == '' ||
      this.newDateBookingResultEnd == ''
    ) {
      this.toastr.error('vui lòng chọn giờ bắt đầu và kết thúc');
      return;
    }
    if (this.bookingForm.value.start == '') {
      this.toastr.error('vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }
    var checkDate = new Date();
    var currentDate: any = this.formatDate(checkDate);
    var newCheck = parseInt(currentDate.split('-')[2]);
    var checkMonth = parseInt(currentDate.split('-')[1]);
    var newDateBookCheck = this.bookingForm.value.start?.split('-')[2];
    var checkMonthBook = this.bookingForm.value.start?.split('-')[1];

    if (
      Number(checkMonth) > Number(checkMonthBook) ||
      (Number(checkMonth) === Number(checkMonthBook) &&
        Number(newCheck) > Number(newDateBookCheck))
    ) {
      console.log('1');
      this.toastr.error('Không được chọn ngày ở quá khứ');
      return;
    }
    const startValue = this.bookingForm.value.start;
    const endValue = this.bookingForm.value.start;
    const newIdService = this.serviceUsed.map((ite) => ite.id);
    let arrayId = [];
    for (const newi of this.serviceUsed) {
      arrayId.push(newi.id);
    }
    console.log(startValue, 'startValue');
    console.log(endValue, 'endValue');
    console.log(endValue, 'endValue');
    console.log(
      this.newDateBookingResultStart,
      'this.newDateBookingResultStart'
    );
    console.log(this.newDateBookingResultEnd, 'this.newDateBookingResultEnd');
    const newDataBooking = {
      fieldId: this.params.snapshot.params['id'],
      start: this.newDateBookingResultStart,
      end: this.newDateBookingResultEnd,
      status: this.bookingForm.value.status || '1',
      description: this.bookingForm.value.description || '',
      services: arrayId,
    };
    const newDataBooking3 = {
      fieldId: this.params.snapshot.params['id'],
      start: this.newDateBookingResultStart,
      end: this.newDateBookingResultEnd,
      status: this.bookingForm.value.status || '1',
      description: this.bookingForm.value.description || '',
      services: this.serviceUsed,
    };
    localStorage.setItem('booking', JSON.stringify(newDataBooking3));
    this.postService.createBookingFb(newDataBooking).subscribe(() => {
      this.bookingForm.reset();
      this.toastr.success('Booking thành công');
      const checkConfirm = window.confirm('bạn có muốn thanh toán ?');
      if (checkConfirm) {
        window.location.href = '/cart';
      }

      setTimeout(() => {
        window.location.reload();
      }, 400);
    });
  }

  handelGetgetField() {
    this.postService.getAllPosts().subscribe((postsData) => {
      console.log(postsData.data.items, '.posts.docs');
      this.getField = postsData.data.items.slice(0, 4);
      // this.paginationObj.currentPage = postsData.posts.page;
      // this.paginationObj.totalPage = postsData.posts.totalPages;
      // this.paginationObj.totalDocs = postsData.posts.totalDocs;
      // this.paginationObj.limit = postsData.posts.limit;
      // this.paginationObj.hasNextPage = postsData.posts.hasNextPage;
      // this.paginationObj.hasPrevPage = postsData.posts.hasPrevPage;
      // this.paginationObj.totalPagesArray = Array(this.paginationObj.totalPage)
      //   .fill(0)
      //   .map((_, index) => index + 1);
    });
  }
  bookedTimes: string[] = [
    '2024-27-03T08:00',
    '2024-04-01T10:00',
    '2024-04-01T14:00',
  ];

  // Phương thức kiểm tra xem một thời gian đã được đặt hay chưa

  handelUseService(data: any) {
    const existingServiceIndex = this.serviceUsed.findIndex(
      (item) => item.id === data.id
    );
    if (existingServiceIndex !== -1) {
      // Nếu dịch vụ đã được chọn trước đó, tăng số lượng và cập nhật tổng tiền
      this.serviceUsed[existingServiceIndex].quantity++;
      this.total += data.price;
    } else {
      // Nếu đây là lần đầu tiên chọn dịch vụ, thêm vào mảng với số lượng là 1
      this.serviceUsed.push({ ...data, quantity: 1 });
      this.total += data.price;
    }
  }
  getServiceQuantity(id: number): number {
    const service = this.serviceUsed.find((item) => item.id === id);
    return service ? service.quantity : 0;
  }
  handelRemoveServiceUsed(i: any) {
    this.serviceUsed[i].quantity--;
    if (this.serviceUsed[i].quantity === 0) {
      // Nếu số lượng giảm xuống 0, xóa dịch vụ khỏi mảng
      this.serviceUsed.splice(i, 1);
    }
    this.total -= this.serviceUsed[i].price;
  }
  payToVNPay() {
    alert('Pay to VN');
  }
  handelCheckedDate(data: any) {
    var checkDate = new Date();
    var currentDate: any = this.formatDate(checkDate);
    var newCheck = parseInt(currentDate.split('-')[2]);
    var checkMonth = parseInt(currentDate.split('-')[1]);
    var newDateBookCheck = this.bookingForm.value.start?.split('-')[2];
    var checkMonthBook = this.bookingForm.value.start?.split('-')[1];

    if (data.booked == true && this.checkDisabled == false) {
      this.toastr.error('Sân đã có người đặt từ trước');
      return;
    } else {
      this.checkedTimeBook = data.start;
      this.newDateBookingResultStart = data.start;
      this.newDateBookingResultEnd = data.end;
    }
  }
  handelGetPostsRelate(id: any) {
    var data = {
      userId: id,
      status: 'Approved',
    };
    this.postService.getPostsRelate(data).subscribe((result: any) => {
      console.log(result);
      this.dataPostsRelate = result.data.items.slice(0, 4);
      console.log(this.dataPostsRelate, 'result');
    });
  }
  formatDate(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  handelChangeEventBooking(event: any) {
    const selectedDate = (event.target as HTMLInputElement).value;
    console.log(selectedDate);
    var checkDate = new Date();
    var currentDate: any = this.formatDate(checkDate);
    var newCheck = parseInt(currentDate.split('-')[2]);
    var checkMonth = parseInt(currentDate.split('-')[1]);
    var newDateBookCheck = parseInt(selectedDate?.split('-')[2]);
    var checkMonthBook = parseInt(selectedDate?.split('-')[1]);
    var checkDayBook = parseInt(selectedDate?.split('-')[0]);
    if (
      Number(checkMonth) > Number(checkMonthBook) ||
      (Number(checkMonth) === Number(checkMonthBook) &&
        Number(newCheck) > Number(newDateBookCheck))
    ) {
      console.log('1');
      this.toastr.error('Không được chọn ngày ở quá khứ');
      this.checkDisabled = false;

      return;
    } else if (Number(newCheck) == Number(newDateBookCheck)) {
      this.checkDisabled = false;
    } else {
      this.checkDisabled = false;
      this.postService
        .getPost(this.idPost!, newDateBookCheck, checkMonth, checkDayBook)
        .subscribe(
          (data) => {
            this.idUserCreatePost = data.data.userId;
            console.log(data.data.userId, 'db');
            this.total = data.data.price;
            this.post = data.data;
            this.getTimeField = data.data.fieldTimes;
            this.serviceField = data.data.services;
            this.handelGetPostsRelate(data.data.userId);
            // this.cateService
            //   .getRelatedPost(data.post.category._id)
            //   .subscribe(({ data }) => {
            //     this.relatedPosts = data.posts!;
            //   });
            console.log(this.idUserCreatePost, 'this.idUserCreatePost');
          },
          () => {
            this.toastr.error("Couldn't find this post.Please try again😥😥");
          }
        );
    }
  }
}

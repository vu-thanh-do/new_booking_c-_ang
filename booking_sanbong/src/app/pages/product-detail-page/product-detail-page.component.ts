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
  relatedPosts!: IPosts[];
  comments!: IResViewComment[];
  urlImage: string = environment.API_URL + '/root/';
  getTimeField: any[] = [];
  getTimeField2: any[] = [];
  getTimeField3: any[] = [];
  getTimeField4: any[] = [];

  idPost!: string;
  getField!: any;
  bookingForm = this.builder.group({
    fieldId: ['', Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
    status: ['1', Validators.required],
    description: ['', Validators.required],
  });
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

      if (this.idPost) {
        /* get all comment by id with socket */
        console.log(id);
      }

      this.postService.getPost(id!).subscribe(
        (data) => {
          console.log(data.data, 'db');
          this.post = data.data;
          this.getTimeField = data.data.fieldTimes;

          // this.cateService
          //   .getRelatedPost(data.post.category._id)
          //   .subscribe(({ data }) => {
          //     this.relatedPosts = data.posts!;
          //   });
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
    // Lấy giá trị ngày và giờ từ form
    const startValue = this.bookingForm.value.start;
    const endValue = this.bookingForm.value.end;

    // Kiểm tra nếu cả hai giá trị start và end không rỗng
    if (startValue && endValue) {
      // Chuyển đổi các giá trị ngày và giờ thành đối tượng Date dựa trên múi giờ hiện tại của máy tính
      const startUtc = new Date(startValue);
      const endUtc = new Date(endValue);

      // Chuyển đổi múi giờ từ UTC sang múi giờ của Việt Nam (UTC+7)
      const startLocal = new Date(startUtc.getTime() + 7 * 60 * 60 * 1000);
      const endLocal = new Date(endUtc.getTime() + 7 * 60 * 60 * 1000);

      // Tạo đối tượng newDataBooking với các giá trị đã chuyển đổi
      const newDataBooking = {
        fieldId: this.params.snapshot.params['id'],
        start: startLocal,
        end: endLocal,
        status: this.bookingForm.value.status || '1',
        description: this.bookingForm.value.description || '',
      };

      // Gọi phương thức createBookingFb từ service và đăng ký subscribe cho nó
      this.postService.createBookingFb(newDataBooking).subscribe(() => {
        // Sau khi đặt hàng thành công, đặt lại form và hiển thị thông báo
        this.bookingForm.reset();
        this.toastr.success('Booking thành công');
        alert('Booking thành công !');
        setTimeout(() => {
          window.location.reload();
        }, 400);
      });
    } else {
      // Nếu start hoặc end rỗng, hiển thị thông báo lỗi
      this.toastr.error('Các trường start và end không được để trống');
    }
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
  isDateTimeDisabled(inputName: string): boolean {
    const inputValue = this.bookingForm.get(inputName)?.value;
    const inputTime = inputValue.slice(11); // Cắt bớt phần ngày để chỉ lấy thời gian
    const isBooked = this.bookedTimes.includes(inputTime);
    return isBooked;
  }
}

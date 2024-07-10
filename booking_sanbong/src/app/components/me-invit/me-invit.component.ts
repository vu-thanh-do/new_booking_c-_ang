import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamserviceService } from 'src/app/services/team/teamservice.service';

@Component({
  selector: 'app-me-invit',
  templateUrl: './me-invit.component.html',
  styleUrls: ['./me-invit.component.scss'],
})
export class MeInvitComponent implements OnInit {
  user: any;
  dataInvitMe: any[] = [];
  teamAll: any[] = [];
  theadTable: string[] = ['STT', 'Tên team', 'số điện thoại', 'level', 'tuổi'];
  // đồng ý hoặc từ chối
  idMyteam: any = '';
  isCheckRejected: boolean = false;
  constructor(
    private TeamserviceService: TeamserviceService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.idMyteam = id;
    });
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getAllTeamByUSer();
    this.getAllTeamByUSer();
    this.getAllTeamByUSer();
    this.getInvitV2();
    this.getInvitV2();
    this.getInvitV2();
  }
  ngOnInit() {
    this.getAllTeamByUSer();
  }
  getAllTeamByUSer() {
    this.TeamserviceService.getAllTeamByUser().subscribe((team) => {
      console.log(team, 'team 1212');
      this.teamAll = team.data.items;
    });
  }
  getInvitV2() {
    this.TeamserviceService.getInvitV2(this.idMyteam).subscribe((data: any) => {
      var newData = data.filter((items: any) => {
        console.log(items.accepted ,'items in')
        return items.accepted == false && this.idMyteam == items.inviteTeamId;
      });
      const newArray = newData.map((item1: any) => {
        const matchedItem = this.teamAll.find(
          (item2: any) => item2.id == item1.teamId
        );
        console.log(this.teamAll, 'newArray');
        return {
          ...item1,
          name: matchedItem ? matchedItem.name : null,
          age: matchedItem ? matchedItem.age : null,
          level: matchedItem ? matchedItem.level : null,
          phone: matchedItem ? matchedItem.phone : null,
        };
      });
      this.dataInvitMe = newArray;
      console.log(this.dataInvitMe, 'newDatanewDatanewData');
    });
  }
}

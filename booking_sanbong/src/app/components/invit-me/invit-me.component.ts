import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamserviceService } from 'src/app/services/team/teamservice.service';

@Component({
  selector: 'app-invit-me',
  templateUrl: './invit-me.component.html',
  styleUrls: ['./invit-me.component.scss'],
})
export class InvitMeComponent {
  user: any;
  dataInvitMe: any[] = [];
  teamAll: any[] = [];
  theadTable: string[] = ['STT', 'Tên team', 'số điện thoại', 'level', 'tuổi'];
  idMyteam: any = '';
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
  }
  getAllTeamByUSer() {
    this.TeamserviceService.getAllTeamByUser().subscribe((team) => {
      this.teamAll = team.data.items;
    });
  }
  getInvitV2() {
    this.TeamserviceService.getInvitV3(this.idMyteam).subscribe((data: any) => {
      var newData = data.filter((items: any) => {
        return items.accepted == null && this.idMyteam == items.teamId;
      });
      const newArray = newData.map((item1: any) => {
        const matchedItem = this.teamAll.find(
          (item2: any) => item2.id == item1.inviteTeamId
        );
        return {
          ...item1,
          name: matchedItem ? matchedItem.name : null,
          age: matchedItem ? matchedItem.age : null,
          level: matchedItem ? matchedItem.level : null,
          phone: matchedItem ? matchedItem.phone : null,
        };
      });
      this.dataInvitMe = newArray;
    });
  }
  actionOnInvite(id: string, action: any) {
    var dataAcept = {
      id: id,
      accept: action == 1 ? true : false,
    };
    this.TeamserviceService.actionOnInviteAPI(dataAcept).subscribe(() => {
      this.getAllTeamByUSer();
      window.location.href = '/create-team';
    });
  }
}

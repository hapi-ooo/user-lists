import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from './user';
import { UserService } from './user.service';

interface UserUI {
  user: User,
  selected: boolean,
  clicked: boolean,
}

function UserUI(user: User): UserUI {
  return {user: user, selected: false, clicked: false};
}

const NULL_USER = UserUI({id:-1, name:''});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private user$?: Subscription;
  users: UserUI[] = [];

  private clickSub$?: ReplaySubject<UserUI>; 

  @Input() newUserField?: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.initUsers();
    this.initClick();
  }

  initUsers() {
    this.user$ = this.userService.observeUsers().subscribe(users => {
      this.users = users.map(u => UserUI(u));
    });
  }

  initClick() {
    this.clickSub$ = new ReplaySubject<UserUI>(1);
    this.clickSub$.next(NULL_USER);
  }

  click(u: UserUI): void {
    u.clicked = !u.clicked;
    this.clickSub$?.pipe(take(1),).subscribe( last => {
      if (u === last) {
        this.clickSub$?.next(NULL_USER);
      } else {
        last.clicked = false;
        this.clickSub$?.next(u);
      }
    })
  }

  getClicked(): UserUI {
    let out = NULL_USER;
    this.clickSub$?.pipe(take(1)).subscribe(u => out = u);
    return out;
  }

  getSelected(): UserUI[] {
    return this.users.filter(u => u.selected);
  }

  selectAll(): void {
    this.users.forEach(u => u.selected = true)
  }

  unselectAll(): void {
    this.users.forEach(u => u.selected = false)
  }

  select(): void {
    if(this.getClicked()) {
      this.getClicked().selected = true;
    }
  }

  unselect(): void {
    if(this.getClicked()) {
      this.getClicked().selected = false;
    }
  }

  addUser(): void {
    if(this.newUserField?.trim()) {
      let newID = Math.max(...this.users.map(u => u.user.id))+1;
      this.userService.addUser({id: newID, name: this.newUserField});
      this.newUserField='';
    }
  }

  deleteSelectedUsers(): void {
    this.getSelected().forEach(u => this.userService.deleteUser(u.user.id));
  }
}

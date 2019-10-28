import { Injectable } from '@angular/core';
import {Board} from '../data/ExempleOfBoard';
import {Action, Element, Grid, Image, Interaction} from '../types';
import {DomSanitizer} from '@angular/platform-browser';
import {UsertoolbarService} from './usertoolbar.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(public userToolBarService: UsertoolbarService, public sanitizer: DomSanitizer) {
    this.board  = Board;
    // new Grid('grid', [] as Element[], [] as Image[], [] as Action[], [] as Interaction [], 'grid', [] as {ElementType: string, Link: string}[]);
  }

  board;
  currentFolder = '.';


  currentPerson = '';
  currentGender = 'masculine';
  currentNumber = '';

  elementCondamne: Element = null;


  getTempList() {
    return this.board.ElementList.filter(elt =>  {
      return this.currentFolder === elt.ElementFolder;
    });
  }

  belongToActiveFolder(element) {
    return true;
  }

  delete(element: Element) {
    this.userToolBarService.popup = true;
    this.elementCondamne = element;
  }
  executer() {
    this.board.ElementList = this.board.ElementList.filter(x => x !== this.elementCondamne);
    this.elementCondamne = null;
  }

  getImgUrl(element: Element) {
      const s = this.board.ImageList.find(x => x.ImageID === element.ImageID).ImagePath;
      return this.sanitizer.bypassSecurityTrustStyle('url(' + s + ')');
  }

  elementColor(element: Element) {
   // return element.ElementType === 'button' ? 'greenyellow' : ('folder' ? 'orange' : 'red');
    return element.Color;
  }

  backToPreviousFolder() {
    const path = this.currentFolder.split('.');
    let temp = '';
    path.slice(0, path.length - 1).forEach( value =>
      temp = '.' + value
    ) ;
    this.currentFolder = temp;
  }
}
import {Component, OnInit} from '@angular/core';
import {DbnaryService} from '../../services/dbnary.service';
import {BoardService} from '../../services/board.service';
import {GeticonService} from '../../services/geticon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {GridElement, ElementForm, Interaction, Page, FolderGoTo} from '../../types';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {Router} from '@angular/router';
import {PaletteService} from '../../services/palette.service';
import {EditionService} from '../../services/edition.service';
import {Ng2ImgMaxService} from "ng2-img-max";
import {HttpClient} from "@angular/common/http";
import {UsertoolbarService} from "../../services/usertoolbar.service";

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css'],
  providers: [Ng2ImgMaxService, HttpClient]
})
export class EditionComponent implements OnInit {

  constructor(public editionService: EditionService, public  paletteService: PaletteService,
              private router: Router, public userToolBarService: UsertoolbarService,
              public indexedDBacess: IndexeddbaccessService,
              public sanitizer: DomSanitizer, public getIconService: GeticonService,
              public dbnaryService: DbnaryService, public boardService: BoardService) {

  }


  /**
   * update the informations with the elementToModify if it exist and set the elementListener for listening next element modifications
   */
  ngOnInit() {
    this.updateModifications();
    this.editionService.ElementListener.subscribe(value => {
      if (value != null) {
        this.updateModifications();
      }
    });
  }

  /*select given edit page menu item*/
  selectMenu(name: string) {
    this.editionService.currentEditPage = name;
  }

  /**
   * Clear the informtation of the edition panel, reset all the information to their initial value
   */
  clear() {
    this.editionService.name = '';
    this.editionService.curentColor = '#d3d3d3';
    this.editionService.imageURL = '';
    this.dbnaryService.wordList = [];
    this.dbnaryService.typeList = [];
    this.editionService.selectedElements = [];
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }


  /**
   * Save the modified or new element update the indexedDB database with it and close the edition panel
   *
   */
  save() {
    this.indexedDBacess.update();
    if (this.editionService.currentEditPage !== "") {
      this.editionService.currentEditPage = ""
    } else {
      if (this.editionService.add) {
        this.createNewButton();
      } else if (this.editionService.selectedElements.length === 1) {
        this.modifyButton();
      } else if (this.editionService.selectedElements.length > 1) {
        this.modifyAllButtons();
      }
      this.editionService.add = false;
      this.clear();
      this.router.navigate(['']);
    }
  }

  /*open modification for all selected items of the grid*/
  modifyAllButtons() {
    this.editionService.selectedElements.forEach(elt => {

      if (this.editionService.curentColor !== '#d3d3d3') {
        elt.Color = this.editionService.curentColor;
      }
      if (this.editionService.curentBorderColor !== '#d3d3d3') {
        elt.BorderColor = this.editionService.curentBorderColor;
      }

      if (this.editionService.name !== this.editionService.DEFAULT_MULTPLE_NAME) { // todo there is probably a cleaner way to do it
        elt.ElementFormsList.forEach(form => {
          form.LexicInfos.forEach(info => {
            if (info.default) {
              info.default = false;
            }
          });
        });
        elt.ElementFormsList.push(
          {
            DisplayedText: this.editionService.name,
            VoiceText: this.editionService.name,
            LexicInfos: [{default: true}],
            ImageID: elt.ElementFormsList[0].ImageID
          }
        );
      }


      if (this.editionService.imageURL !== 'assets/icons/multiple-images.svg') {
        const img = this.boardService.board.ImageList.find(image => image.ID === elt.ElementFormsList[0].ImageID);
        if (img != null) {
          img.Path = this.editionService.imageURL;
        }
      }
    });
  }

  /**
   * Update the current modified element and load its modifications into the board,
   * given the information of this class, updated by the edition html panel
   */
  modifyButton() {
    if (this.editionService.selectedElements[0] != null && this.editionService.selectedElements[0] !== undefined) {
      const element: GridElement = this.editionService.selectedElements[0];
      element.Type = this.editionService.radioTypeFormat === 'folder' ? new FolderGoTo(element.ID) : this.editionService.radioTypeFormat;
      element.Color = this.editionService.curentColor;
      element.BorderColor = this.editionService.curentBorderColor;
      element.InteractionsList = Object.assign([], this.editionService.interractionList);
      element.ElementFormsList = Object.assign([], this.editionService.variantList);
      this.editionService.getDefaultForm(element.ElementFormsList).DisplayedText = this.editionService.name;
      if (this.editionService.getDefaultForm(element.ElementFormsList).ImageID === '') {
        this.editionService.getDefaultForm(element.ElementFormsList).ImageID = element.ID;
      }
      this.boardService.board.ImageList = this.boardService.board.ImageList.filter(
        img => img.ID !== element.ID);

      this.boardService.board.ImageList.push({
          ID: element.ID,
          OriginalName: this.editionService.name,
          Path: this.editionService.imageURL
        });
    }
  }

  /**
   * Create a new button and add it to the board, given the information of this class, updated by the edition html panel
   */
  createNewButton() {
    let i = 0;
    let tempId = this.editionService.name;
    while (this.boardService.board.ElementList.findIndex(elt => elt.ID === tempId) !== -1) {
      tempId = this.editionService.name + i;
      i = i + 1;
    }

    this.editionService.variantList.push(
      {
        DisplayedText: this.editionService.name,
        VoiceText: this.editionService.name,
        LexicInfos: [{default: true}],
        ImageID: tempId
      }
    );

    const elementFormsList = Object.assign([], this.editionService.variantList);

    const interList: Interaction[] = [
      {ID: 'click', ActionList: [ {ID: 'display', Action: 'display'},{ID: 'say', Action: 'say'}]},
      {ID: 'longPress', ActionList: [{ID: 'otherforms', Action: 'otherforms'}]}
    ];

    this.boardService.board.ElementList.push(
      {
        ID: tempId,
        Type: this.editionService.radioTypeFormat === 'folder' ? new FolderGoTo(tempId): this.editionService.radioTypeFormat ,
        PartOfSpeech: this.editionService.classe,
        ElementFormsList: elementFormsList,
        InteractionsList: interList,
        Color: this.editionService.curentColor,
        BorderColor: this.editionService.curentBorderColor,
        VisibilityLevel: 0
      });

    this.boardService.board.ImageList.push(
      {
        ID: tempId,
        OriginalName: this.editionService.name,
        Path: this.editionService.imageURL
      });

    let currentPage: Page = this.getCurrentPage();
    currentPage.ElementIDsList.push(tempId);
    this.boardService.board.PageList.push(currentPage);
  }

  getCurrentPage(): Page {
    let currentPage = this.boardService.board.PageList.find(page =>{ return page.ID === this.boardService.getCurrentFolder()});
    if(currentPage===null || currentPage===undefined){
      currentPage = this.createAndGetNewPage();
    }
    return currentPage;
  }

  createAndGetNewPage(): Page{
    let name = this.boardService.getCurrentFolder();
   return  {ID: name, Name:name, ElementIDsList: []};
  }

  /**
   * Load the information of the element we have to modify, given by this.userToolBar.modif into the current informations of the class:
   * 'name' is the name of current element to modify, 'events' is the interraction event list, 'color' is its color
   * 'radioTypeFormat' is its current type format (button or folder) and imageUrl is its current imageUrl
   */
  updateModifications() {
    if (this.editionService.selectedElements.length === 1) {
      const elementToModif: GridElement = this.editionService.selectedElements[0];
      this.editionService.name = this.editionService.getDefaultForm(elementToModif.ElementFormsList).DisplayedText;
      this.editionService.curentColor = elementToModif.Color;
      this.editionService.curentBorderColor = elementToModif.BorderColor;
      this.editionService.radioTypeFormat = elementToModif.Type === 'button' ? 'button' : 'folder';
      const imageToModif = this.boardService.board.ImageList.find(x => x.ID === elementToModif.ElementFormsList[0].ImageID);
      if (imageToModif != null && imageToModif !== undefined) {
        this.editionService.imageURL = imageToModif.Path;
      } else {
        this.editionService.imageURL = '';
      }

      if(elementToModif.ElementFormsList!=null && elementToModif.ElementFormsList!=undefined) {
        this.editionService.variantList = Object.assign([], elementToModif.ElementFormsList);
      } else {
        this.editionService.variantList =[];
      }


      if(elementToModif.InteractionsList!=null && elementToModif.InteractionsList!=undefined) {
        this.editionService.interractionList = Object.assign([], elementToModif.InteractionsList);
      } else {
        this.editionService.interractionList = [];
      }

    } else if (this.editionService.selectedElements.length > 1) { // todo see what we want to modify here
      this.editionService.name = '$different$';
      this.editionService.curentColor = '#d3d3d3';
      this.editionService.curentBorderColor = '#d3d3d3';
      this.editionService.radioTypeFormat = '';
      this.editionService.imageURL = 'assets/icons/multiple-images.svg';
      this.editionService.interractionList = [];
    }
  }

  /*return true if the page for alternative forms is the currentEditPage*/
  isDisplayed(page:string) {
    return this.editionService.currentEditPage === page;
  }

}


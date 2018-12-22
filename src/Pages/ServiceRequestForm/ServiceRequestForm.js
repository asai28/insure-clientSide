import React from "react";

/*Imports for modals from reactstrap */
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Alert } from "reactstrap";

/*Imports required for Form Group */
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Container } from "reactstrap";

/*Import tooltip or popover from reactstrap*/
//import { Tooltip } from "reactstrap";
import {Popover, PopoverHeader, PopoverBody} from "reactstrap";

//Importing CSS for body, logo and table of the pdf generator
import "./style.css";

/*Imports required for React Calendar */
import DatePicker from "react-datepicker";
import moment from "moment";
import Moment from "react-moment";
import "react-datepicker/dist/react-datepicker.css";

//Validation icons
import { FaPlus, FaCheckCircle, FaTimesCircle, FaTrash, FaTimes} from "react-icons/fa";

//Importing cities and states for countries
import cities from "../../utils/cities.json";
import states from "../../utils/us-states.json";
import services from "../../utils/services.json";

//Connection to backend
import API from "../../utils/API";

//imports for PDF generation
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
window.html2canvas = html2canvas;

const styles = {
  pdf: {
    padding: "10px 10px",
    height: "180mm",
    width: "200mm"
  },
  h4: {
    color: "#000"
  },
  logo: {
    float: "right",
    height: "100px",
    width: "300px"
  },
  info: {
    float: "left"
  },
  content: {
    clear: "both"
  },
  quotation: {
    fontFamily: "Andika",
    color: "#009999"
  },
  billedTo: {
    float: "left"
  },
  quote: {
    float: "right"
  },
  FaPlus: {
    color: "#339933"
  },
  FaCheck: {
    color: "#339933"
  },
  FaTimes: {
    color: "#cc3300"
  },
  note: {
    fontFamily: "Palatino Linotype",
    fontSize: "0.75em",
    fontWeight: "500"
  },
  notify: {
    color: "#228B22",
    display: "none",
    fontWeight: "700"
  },
  removeContactNotification: {
    color: "#E82C0C",
    display: "none",
    fontWeight: "700"
  }
};

//Initialized outside to add new equipments on the fly
var equipmentsAlwaysOnSite = [
  "Laptop",
  "projectorScreen",
  "Table",
  "trainingKit",
  "forkliftTrainingKit",
  "CPRmannequins",
  "firstAidAEDKit",
  "Handouts"
];
var equipmentIDs = [
  "Laptop",
  "projectorScreen",
  "Table",
  "trainingKit",
  "forkliftTrainingKit",
  "CPRmannequins",
  "firstAidAEDKit",
  "Handouts"
];

//Unique Companies
var uniqueCompanies = [];

//Get employee names from API.js
var employees = [];

//Get company Details, contacts, locations
var getCompanyDetails = [];
var getCompanyContacts = [];
var getCompanyLocations = [];

//Get all US states
var us_states = [];
for (let key in states) {
  us_states.push(states[key]);
}

function getInitial(state) {
  for (let key in states) {
    if (states[key] === state) {
      return key;
    }
  }
}

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    //State variables for form elements and their validation
    this.state = {
      startDate: moment(),
      validThru: moment()
        .add(90, "days")
        .format("YYYY-MM-DD"),
      newContractClient: false,
      companyName: "",
      newCompanyName: "",
      companyNames: services.companyName,
      country: "United States",
      topic: "",
      service: "",
      producer: "",
      sameLocAsTraining: false,
      validCompanyName: false,
      validPhone: false,
      validEmail: false,
      validCellPhone: false,
      validZIP: false,
      contactName: "",
      contactPhone: "",
      contactCellPhone: "",
      contactEmail: "",
      state: "",
      streetAddress: "",
      city: "",
      zip: "",
      contactStreetAddress: "",
      contactZip: "",
      contactCountry: "United States",
      contactState: "",
      contactCity: "",
      //equipmentsForSite: ["Laptop", "Projector Screen", "TV monitor", "Table", "Electrical power socket with extension cord"],
      equipmentsSelectedSite: [],
      equipmentsSelectedTraining: [],
      //equipmentsForTraining : ["Laptop", "Projector Screen", "TV monitor", "Table", "Electrical power socket with extension cord", "Forklift training kit", "CPR mannequins", "First aid training bag", "AED training device", "Handouts"],
      equipments: [
        "Laptop",
        "Projector Screen",
        "Table",
        "Training Kit (Green Duffle Bag)",
        "Forklift Training Kit (Grey Duffle Bag)",
        "CPR mannequins",
        "First Aid & AED Kit (Red Backpack)",
        "Handouts"
      ],
      Laptop: false,
      projectorScreen: false,
      Table: false,
      trainingKit: false,
      forkliftTrainingKit: false,
      CPRmannequins: false,
      firstAidAEDKit: false,
      RespiratorFitTestKit: false,
      Handouts: false,
      active: true,
      addOn: "",
      error: {},
      modal: false,
      quotationIssuedBy: "",
      instructions: "",
      serviceModal: false,
      billableService: true,
      alternateName: "",
      costForService: 0.0,
      requestedServices: [],
      requestedServiceRows: [],
      viewServiceRows: [],
      totalCost: 0,
      viewServiceModal: false,
      showTopics: false,
      popoverOpen: false,
      description: "",
      companyMobileContacts: [],
      companyOfficeContacts: [],
      companyLocations: [],
      listOfServices: [],
      additionalEquipments: [],
      quotationNumber: ""
    };
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.validateCellPhone = this.validateCellPhone.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateZIP = this.validateZIP.bind(this);
    this.handleCompanyName = this.handleCompanyName.bind(this);
    this.handlePDF = this.handlePDF.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.getEmployees = this.getEmployees.bind(this);
    this.saveCompany = this.saveCompany.bind(this);
    this.addContact = this.addContact.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.getCompanies = this.getCompanies.bind(this);
    this.addService = this.addService.bind(this);
    this.toggleServiceModal = this.toggleServiceModal.bind(this);
    this.toggleViewServicesModal = this.toggleViewServicesModal.bind(this);
    this.getPriceAndQuantity = this.getPriceAndQuantity.bind(this);
    this.getServices = this.getServices.bind(this);
    this.saveServices = this.saveServices.bind(this);
    this.removeServices = this.removeServices.bind(this);
    this.togglePopOver = this.togglePopOver.bind(this);
  }
  
  componentDidMount = () => {
    this.getEmployees();
    this.getCompanies();
    document.getElementById('addEquipment').style.display = "none";
  };

  componentWillMount = () => {
    API.getTopicBasedEquipments()
      .then(res => {
        this.setState({
          topicsVsEquipments : res.data
        });
        console.log("topic vs equipments loaded!");
      })
      .catch(err => console.log(err));
    API.getListOfServices()
    .then(res => {
      console.log(res);
      this.setState({
        listOfServices :res.data
      })
      
      console.log("services list loaded!");
    })
    .catch(err => console.log(err));
  };

  getPriceAndQuantity = () => {
    var result = this.state.topicsVsEquipments.filter(
      element => element.topic === this.state.topic
    )[0];
    if (result !== {} && this.state.topic.trim() !== "") {
      document.getElementById("numServiceUnits").value = result.serviceUnits;
      document.getElementById("durationInMin").value = result.DurationInMin;
      document.getElementById("costForService").value = result.costOfService;

      this.setState({
        service: "Training - " + this.state.topic,
        Laptop: this.state.Laptop || result.Laptop,
        projectorScreen: this.state.projectorScreen || result.projectorScreen,
        Table: this.state.Table || result.Table,
        trainingKit: this.state.trainingKit || result.trainingKit,
        forkliftTrainingKit: this.state.forkliftTrainingKit || result.forkliftTrainingKit,
        CPRmannequins: this.state.CPRmannequins || result.CPRmannequins,
        firstAidAEDKit: this.state.firstAidAEDKit || result.firstAidAEDKit,
        RespiratorFitTestKit: this.state.RespiratorFitTestKit || result.RespiratorFitTestKit,
        Handouts: this.state.Handouts || result.Handouts,
        costForService: result.costOfService
      });
    }

    var result2 = this.state.listOfServices
    .filter(element => element.service === this.state.service)[0];
    if (result2 !== undefined && this.state.service.trim() !== "" && this.state.service !== "Training") {
      document.getElementById("numServiceUnits").value = result2.qty;
      document.getElementById("costForService").value = result2.cost;

      this.setState({
        service: this.state.service,
        showTopics: false,
        description: result2.description
      });
    }
  };

  getAvailableEquipments = () => {
    //console.log(this.state.companyName);
    var checkedEquipments = [];
    var row = {};
    if (this.state.companyName.trim() !== "") {
      for (let i = 0; i < this.state.topicsVsEquipments.length; ++i) {
        if (this.state.topicsVsEquipments[i].topic === this.state.topic) {
          row = this.state.topicsVsEquipments[i];
          break;
        }
      }
    }
  };

  addContact = () => {
    var item = {
      newCompanyName: this.state.newCompanyName,
      newContactName: this.state.newContactName,
      newContactEmail: this.state.newContactEmail,
      newContactOfficePhone: this.state.newContactOfficePhone,
      newContactMobilePhone: this.state.newContactMobilePhone,
      newContactMobilePhoneAlternate: this.state.newContactMobilePhoneAlternate,
      mainContact: this.state.mainContact
    };
    API.newCompanyContact(item)
      .then(res => {
        console.log(res);
        document.getElementById("newContactPhone").reset();
      })
      .catch(err => console.log(err));

    document.getElementById("notifyContactAdded").style.display = "block";
    document.getElementById("removeContactNotification").style.display =
      "block";
  };

  addLocation = () => {
    var item = {
      newCompanyName: this.state.newCompanyName,
      newContactStreetAddress: this.state.newContactStreetAddress,
      newContactCity: this.state.newContactCity,
      newContactState: this.state.newContactState,
      newContactZIP: this.state.newContactZIP,
      newContactCountry: this.state.newContactCountry,
      mainLocation: this.state.mainLocation
    };
    API.newCompanyLocation(item)
      .then(res => {
        console.log(res);
        document.getElementById("newContactLocation").reset();
      })
      .catch(err => console.log(err));

    document.getElementById("notifyLocationAdded").style.display = "block";
    document.getElementById("removeLocationNotification").style.display =
      "block";
  };

  addService = () => {
    var item = {
      companyName: this.state.companyName,
      service: this.state.service,
      billable: this.state.billableService,
      qty: document.getElementById("numServiceUnits").value === undefined ? 0 : parseFloat(document.getElementById("numServiceUnits").value),
      alternateName: this.state.alternateName.length === 0 ? this.state.service : this.state.alternateName,
      cost: document.getElementById("costForService").value === undefined ? 0 : parseFloat(document.getElementById("costForService").value),
      serviceDescription: this.state.description
    };

    console.log(item);

    API.newServiceRequest(item)
      .then(res => {
        console.log(res);
        // this.setState({
        //   topic: "",
        //   service: "",
        //   description: "",
        //   costForService: 0,
        //   billable: false,
        //   alternateName: this.state.topic
        // });
      })
      .catch(err => console.log(err));

    //Clear all fields to add further services
    document.getElementById("addService").reset();
  };

  saveServices = () => {
    API.getServiceRequests()
      .then(res => {
        if (this.state.service.trim() !== "") {
          this.addService();
        }
        this.setState({
          requestedServices : res.data
        })
        this.setState({
          requestedServiceRows: this.getServices()
        });
      })
      .catch(err => console.log(err));
    this.toggleServiceModal();
  };

  getServices = () => {
    return this.state.requestedServices
      .filter(x => x.billable === true)
      .map((x, index) => (
        <tr key={"serviceRequest" + (index + 1)}>
          <td>{x.alternateName}</td>
          <td>{x.qty}</td>
          <td>{x.cost.toFixed(2)}</td>
          <td>${(x.qty * x.cost).toFixed(2)}</td>
          {this.setState({
            totalCost: this.state.totalCost + x.qty * x.cost * x.billable
          })}
        </tr>
      ));
  };

  removeServices = () => {
    var result = [];
    API.getServiceRequests()
      .then(res => {
        this.setState({
          requestedServices : res.data
        })
        console.log("remove services",this.state.requestedServices);
        result =  this.state.requestedServices
          .map((x, index) => (
            <tr key={"serviceRequest" + (index + 1)} id = {"serviceRequest" + (index + 1)}>
              <td>{x.alternateName}</td>
              <td>{x.qty}</td>
              <td>{x.cost.toFixed(2)}</td>
              <td>${(x.qty * x.cost).toFixed(2)}</td>
              <td><FaTrash style = {{'color': 'red'}} onClick = {() => {
                API.deleteService(x.alternateName)
                .then(res => {
                  this.setState({
                    totalCost: this.state.totalCost - x.qty * x.cost * x.billable
                  });
                  })
                .catch(err => console.log(err));
              }}/>
              </td>
            </tr>
          ));
      })
      .catch(err => console.log(err));
      return result
  };

  getCompanies = () => {
    API.getCompany()
      .then(res => {
        for (let i = 0; i < res.data.length; ++i) {
          if (uniqueCompanies.indexOf(res.data[i].companyName) === -1 && res.data[i].companyName.trim() !== "") {
            uniqueCompanies.push(res.data[i].companyName);
          }
        }
        this.setState({ companyNames: uniqueCompanies });
        console.log("Companies table loaded");
      })
      .catch(err => console.log(err));
  };

  saveCompany = () => {
    this.addContact();
    this.addLocation();
    var item = {
      companyName: this.state.newCompanyName,
      newCompanyName: this.state.newCompanyName,
      newProducer: this.state.newProducer,
      newAgency: this.state.newAgency,
      newContractClient: this.state.newContractClient,
      Laptop: this.state.Laptop,
      projectorScreen: this.state.projectorScreen,
      Table: this.state.Table,
      trainingKit: this.state.trainingKit,
      forkliftTrainingKit: this.state.forkliftTrainingKit,
      CPRmannequins: this.state.CPRmannequins,
      firstAidAEDKit: this.state.firstAidAEDKit,
      Handouts: this.state.Handouts
    };
    API.newCompany(item)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));

    API.postCompanyEquipments(item)
      .then(res => console.log(res))
      .catch(err => console.log(err));

    this.getCompanies();
    this.toggleModal();
    console.log(this.state.newCompanyName, this.state.companyName);
  };

  //Getting employees from server
  getEmployees() {
    API.getEmployees().then(function(res) {
      for (let i = 0; i < res.data.length; ++i) {
        employees.push(res.data[i].EMP_NAME);
      }
      console.log("employees table loaded!");
    });
  }

  //Generates pdf
  handlePDF = () => {
    var companyName = this.state.companyName;
    var startDate = this.state.startDate;
    var divHeight = document.getElementById("capture").offsetHeight;
    var divWidth = document.getElementById("capture").offsetWidth;
    return html2canvas(document.getElementById("capture"), {
      scale: 0.85,
      dpi: 278
    }).then(function(canvas) {
      var wid = divWidth;
      var hgt = divHeight;
      var img = canvas.toDataURL(
        "image/png",
        (wid = canvas.width),
        (hgt = canvas.height)
      );
      var hratio = hgt / wid;
      var doc = new jsPDF("p", "mm", "a4");
      var width = doc.internal.pageSize.width;
      var height = width * hratio;
      doc.addImage(img, "JPEG", 20, 25, width, height);
      console.log(startDate.toDate());
      doc.save(
        companyName + "-Quotation-" + startDate.format("MM/DD/YYYY") + ".pdf"
      );
    });
  };

  handleCompanyName = () => {
    if (
      this.state.companyName.length < 2 &&
      this.state.newCompanyName.length < 2
    ) {
      this.setState({
        validCompanyName: false
      });
    } else {
      this.setState({
        validCompanyName: true
      });
    }

    API.getCompanyDetails(this.state.companyName)
      .then(res => {
        getCompanyDetails = res.data;
      })
      .catch(err => console.log(err));

      if(this.state.companyName.trim() !== ""){
        API.getCompanyContacts(this.state.companyName)
          .then(res => {
            getCompanyContacts = res.data;
            this.setState({
              companyMobileContacts: res.data.filter(x => x.contactMobilePhone !== ""),
              companyOfficeContacts: res.data.filter(x => x.contactOfficePhone !== "")
            })
          })
          .catch(err => console.log(err));
          API.getCompanyLocations(this.state.companyName)
            .then(res => {
              getCompanyLocations = res.data;
              this.setState({
                companyLocations: res.data
              })
            })
            .catch(err => console.log(err));
      }


    this.getAvailableEquipments();

    API.getCompanyEquipments(this.state.companyName)
      .then(res => {
        if(res.data.length > 0 && this.state.companyName.length > 0 ){
          var result = res.data[0];
          this.setState({
            Laptop: this.state.Laptop || !result.Laptop,
            projectorScreen: this.state.projectorScreen || !result.projectorScreen,
            Table: this.state.Table || !result.Table,
            trainingKit: this.state.trainingKit || !result.trainingKit,
            forkliftTrainingKit: this.state.forkliftTrainingKit || !result.forkliftTrainingKit,
            CPRmannequins: this.state.CPRmannequins || !result.CPRmannequins,
            firstAidAEDKit: this.state.firstAidAEDKit || !result.firstAidAEDKit,
            RespiratorFitTestKit: this.state.RespiratorFitTestKit || !result.RespiratorFitTestKit,
            Handouts: this.state.Handouts || !result.Handouts
          });
          document.getElementById('Laptop').checked = this.state.Laptop;
          document.getElementById('projectorScreen').checked = this.state.projectorScreen;
          document.getElementById('Table').checked = this.state.Table;
          document.getElementById('trainingKit').checked = this.state.trainingKit;
          document.getElementById('forkliftTrainingKit').checked = this.state.forkliftTrainingKit;
          document.getElementById('CPRmannequins').checked = this.state.CPRmannequins;
          document.getElementById('firstAidAEDKit').checked = this.state.firstAidAEDKit;
          document.getElementById('RespiratorFitTestKit').checked = this.state.RespiratorFitTestKit;
          document.getElementById('Handouts').checked = this.state.Handouts;
        }
      })
      .catch(err => console.log(err));
  };

  validatePhone = () => {
    var re = RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);
    this.setState({
      validPhone: re.test(this.state.contactPhone) || isNaN(this.state.contactPhone)
    });
  };

  validateCellPhone = () => {
    var re = RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);
    this.setState({
      validCellPhone: re.test(this.state.contactCellPhone) || isNaN(this.state.contactPhone)
    });
  };

  validateEmail = () => {
    var re = RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    this.setState({
      validEmail: re.test(String(this.state.contactEmail).toLowerCase())
    });
  };

  validateZIP = () => {
    let zipRegex = RegExp("^[0-9]{5}(?:-[0-9]{4})?$");
    this.setState({
      validZIP: zipRegex.test(this.state.zip)
    });
  };

  handleChange(date) {
    this.setState({
      startDate: date
    });
    this.setState({
      validThru: moment(date)
        .add(90, "days")
        .format("YYYY-MM-DD")
    });
    document.getElementById("validThru").value = moment(
      this.state.validThru
    ).format("YYYY-MM-DD");
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      requestedServiceRows: this.getServices()
    });

    var item = {
      companyName: this.state.companyName,
      startDate: this.state.startDate,
      validThru: this.state.validThru,
      paymentBy: this.state.paymentForTraining,
      producer: this.state.producer,
      contactPerson: this.state.contactName,
      contactPhone: this.state.contactPhone,
      contactCellPhone: this.state.contactCellPhone,
      contactEmail: this.state.contactEmail,
      contactState: this.state.contactState,
      contactStreetAddress: this.state.contactStreetAddress,
      contactCity: this.state.contactCity,
      contactZip: this.state.contactZip,
      contactCountry: this.state.country,
      //Equipment needed at site
      Laptop: this.state.Laptop,
      projectorScreen: this.state.projectorScreen,
      Table: this.state.Table,
      trainingKit: this.state.trainingKit,
      forkliftTrainingKit: this.state.forkliftTrainingKit,
      CPRmannequins: this.state.CPRmannequins,
      firstAidAEDKit: this.state.firstAidAEDKit,
      RespiratorFitTestKit: this.state.RespiratorFitTestKit,
      Handouts: this.state.Handouts,
      quotationIssuedBy: this.state.quotationIssuedBy,
      instructions: this.state.instructions
    };
    
    API.postService(item)
    .then(res => {
      console.log(res);
      this.setState({
        quotationNumber: res.data.quoteNumber,
        quotationIssuedBy: res.data.quotationIssuedBy
      });
      API.getServiceRequests()
      .then(res1 => {
          console.log(res.data.quotationIssuedBy);
          console.log(res1);
          API.addTask({
            quotationNumber: this.state.quotationNumber,
            service: "Approve quote " + this.state.quotationNumber,
            client: this.state.companyName,
            instructions: this.state.instructions,
            startDate: this.state.startDate, //sort
            validThru: this.state.validThru,
            quotationIssuedBy: res.data.quotationIssuedBy
          })
          .then(res2 => {
            console.log(res2.data);

                if(res1.data.length > 0){
                  for(let i = 0; i < res1.data.length; ++i ){
                    API.addTask({
                      quotationNumber: this.state.quotationNumber,
                      service: res1.data[i].service,
                      client: res1.data[i].companyName,
                      instructions: this.state.instructions,
                      startDate: this.state.startDate, //sort
                      validThru: this.state.validThru,
                      qty: res1.data[i].qty,
                      serviceDescription: res1.data[i].serviceDescription,
                      quotationIssuedBy: res.data.quotationIssuedBy
                    })
                    .then(res3 => {console.log("Added a task")})
                    .catch(err => console.log(err));
                  }
                }
                console.log("Deleted rows");
                console.log("Added a task to accept quote as well!");
                document.getElementById("serviceRequestForm").reset();
                this.setState({
              startDate: moment(),
              validThru: moment()
                .add(90, "days")
                .format("YYYY-MM-DD"),
                newContractClient: false,
              companyName: "",
              newCompanyName: "",
              companyNames: services.companyName,
              country: "United States",
              topic: "",
              service: "",
              producer: "",
              sameLocAsTraining: false,
              validCompanyName: false,
              validPhone: false,
              validEmail: false,
              validCellPhone: false,
              validZIP: false,
              contactName: "",
              contactPhone: "",
              contactCellPhone: "",
              contactEmail: "",
              state: "",
              streetAddress: "",
              city: "",
              zip: "",
              contactStreetAddress: "",
              contactZip: "",
              contactCountry: "United States",
              contactState: "",
              contactCity: "",
              //equipmentsForSite: ["Laptop", "Projector Screen", "TV monitor", "Table", "Electrical power socket with extension cord"],
              equipmentsSelectedSite: [],
              equipmentsSelectedTraining: [],
              //equipmentsForTraining : ["Laptop", "Projector Screen", "TV monitor", "Table", "Electrical power socket with extension cord", "Forklift training kit", "CPR mannequins", "First aid training bag", "AED training device", "Handouts"],
              equipments: [
                "Laptop",
                "Projector Screen",
                "Table",
                "Training Kit (Green Duffle Bag)",
                "Forklift Training Kit (Grey Duffle Bag)",
                "CPR mannequins",
                "First Aid & AED Kit (Red Backpack)",
                "Handouts"
              ],
              Laptop: false,
              projectorScreen: false,
              Table: false,
              trainingKit: false,
              forkliftTrainingKit: false,
              CPRmannequins: false,
              firstAidAEDKit: false,
              RespiratorFitTestKit: false,
              Handouts: false,
              active: true,
              addOn: "",
              error: {},
              modal: false,
              quotationIssuedBy: "",
              instructions: "",
              serviceModal: false,
              billableService: true,
              alternateName: "",
              costForService: 0.0,
              requestedServices: [],
              requestedServiceRows: [],
              viewServiceRows: [],
              totalCost: 0,
              viewServiceModal: false,
              showTopics: false,
              popoverOpen: false,
              description: "",
              companyMobileContacts: [],
              companyOfficeContacts: [],
              companyLocations: [],
              listOfServices: [],
              additionalEquipments: [],
              quotationNumber: ""
            });
            API.deleteServiceRequests()
          .then(() => {
            console.log("Refresh services table");
          })
          .catch(err => console.log(err));
          })
              .catch(err => console.log(err));
            
            })
            .catch(err => console.log(err));

            
        })
        .catch(err => console.log(err));
        
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
    this.validateEmail();
    this.validateZIP();
    this.validatePhone();
    this.validateCellPhone();
    this.handleCompanyName();
    this.setState({
      active: true
      //((this.state.validCellPhone !== "undefined" && this.state.validCellPhone === true) || (this.state.validEmail !== "undefined" && this.state.validEmail === true) || (this.state.validPhone !== "undefined" && this.state.validPhone === true)) || this.state.validZIP && this.state.validCompanyName
    });
  };

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleServiceModal() {
    this.setState({
      serviceModal: !this.state.serviceModal
    });
  }

  toggleViewServicesModal = () => {
    this.setState({
      viewServiceModal: !this.state.viewServiceModal,
      viewServiceRows: this.removeServices() != undefined ? this.removeServices() : []
    });
    
  };

  togglePopOver() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  viewServiceModal = () => {
    this.setState({
      viewServiceRows: this.removeServices() != undefined ? this.removeServices() : []
    });
  }

  render() {
    return (
      <div>
        <img
          src="./open3.jpg"
          alt="Construction workers"
          className="openingImage"
        />

        <Container className="mt-3">
          <Form id="serviceRequestForm">
          <FormGroup>
              <Label for="quotationIssuedBy">Quotation Issued By</Label>
              <Input
                type="select"
                name="quotationIssuedBy"
                id="quotationIssuedBy"
                onChange={this.handleInputChange}
              >
              <option value="">Choose Quotation Issued By</option>
                {employees.map((x, index) => (
                  <option key={"emp" + index} value={x}>
                    {x}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="companyName">Company Name</Label>
              <Input
                type="select"
                name="companyName"
                id="companyNameSelect"
                onChange={this.handleInputChange}
                onClick={this.handleCompanyName}
              >
                <option>Select company name</option>
                {services.companyNames.map(option => (
                    <option>{option}</option>
                  ))}
              </Input>
              <Label for="newCompanyName">New Company?</Label>
              <div>
                <Button color="secondary" onClick={this.toggleModal}>
                  Add new company
                </Button>
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggleModal}
                  className={this.props.className}
                >
                  <ModalHeader toggle={this.toggleModal}>
                    Enter new company details
                  </ModalHeader>
                  <ModalBody>
                    <Form>
                      <FormGroup>
                        <Label for="newCompanyName">Company Name</Label>
                        <Input
                          type="text"
                          name="newCompanyName"
                          id="newCompanyName"
                          placeholder="Enter company name"
                          onChange={this.handleInputChange}
                        />

                        <Label for="newProducer">Producer</Label>
                        <Input
                          type="text"
                          name="newProducer"
                          id="newProducer"
                          placeholder="Enter producer's name"
                          onChange={this.handleInputChange}
                        />

                        <Label for="newAgency">Agency</Label>
                        <Input
                          type="text"
                          name="newAgency"
                          id="newAgency"
                          placeholder="Enter agency's name"
                          onChange={this.handleInputChange}
                        />

                        <Label for="newContractClient">Contract Clients</Label>
                        <br />
                        <input
                          type="checkbox"
                          id="newContractClient"
                          name="newContractClient"
                          value={this.state.newContractClient}
                          defaultChecked={this.state.newContractClient}
                          onClick={() =>
                            this.setState({
                              newContractClient: !this.state.newContractClient
                            })
                          }
                        />
                        <br />
                      </FormGroup>
                      <hr />

                      <Form id="newContactPhone">
                        <FormGroup>
                          <Label for="newContactName">Contact Name</Label>
                          <Input
                            type="text"
                            name="newContactName"
                            id="newContactName"
                            placeholder="Enter contact's name"
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="newContactEmail">Contact Email ID</Label>
                          <Input
                            type="text"
                            name="newContactEmail"
                            id="newContactEmail"
                            placeholder="Enter contact's email ID"
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="newContactOfficeNumber">
                            Contact Office Number
                          </Label>
                          <Input
                            type="text"
                            name="newContactOfficePhone"
                            id="newContactOfficePhone"
                            placeholder="Enter contact's office phone number"
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="newContactMobilePhone">
                            Contact Mobile Number
                          </Label>
                          <Input
                            type="text"
                            name="newContactMobilePhone"
                            id="newContactMobilePhone"
                            placeholder="Enter contact's mobile number"
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="newContactMobileAlternate">
                            Contact Alternate Mobile Number
                          </Label>
                          <Input
                            type="text"
                            name="newContactMobilePhoneAlternate"
                            id="newContactMobilePhoneAlternate"
                            placeholder="Enter contact's alternate mobile number"
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="mainContact">
                            Is this the main contact?
                          </Label>
                          <br />
                          <input
                            type="checkbox"
                            id="check"
                            name="mainContact"
                            value={this.state.mainContact}
                            defaultChecked={this.state.mainContact}
                            onClick={() =>
                              this.setState({
                                mainContact: !this.state.mainContact
                              })
                            }
                          />
                        </FormGroup>
                        <br />
                        <b style={styles.note}>
                          Click on the plus icon to add more contacts
                        </b>{" "}
                        <br />
                        <div style={styles.FaPlus}>
                          <FaPlus onClick={this.addContact} />
                        </div>
                        <span>
                          <div id="notifyContactAdded" style={styles.notify}>
                            New contact has been added!
                          </div>
                          <div
                            id="removeContactNotification"
                            style={styles.removeContactNotification}
                            onClick={() => {
                              document.getElementById(
                                "removeContactNotification"
                              ).style.display = "none";
                              document.getElementById(
                                "notifyContactAdded"
                              ).style.display = "none";
                            }}
                          >
                            x
                          </div>
                        </span>
                      </Form>

                      <hr />

                      <Form id="newContactLocation">
                        <Label>Company Locations</Label> <br />
                        <Label for="mainLocation">
                          Is this the main office location?
                        </Label>
                        <br />
                        <input
                          type="checkbox"
                          id="check"
                          name="mainLocation"
                          value={this.state.mainLocation}
                          defaultChecked={this.state.mainLocation}
                          onClick={() =>
                            this.setState({
                              mainLocation: !this.state.mainLocation
                            })
                          }
                        />
                        <br />
                        <Label for="newContactStreetAddress">
                          Street Address
                        </Label>
                        <Input
                          type="text"
                          name="newContactStreetAddress"
                          id="newContactStreetAddress"
                          placeholder="Enter street address"
                          onChange={this.handleInputChange}
                        />
                        <Label for="newContactCity">City</Label>
                        <Input
                          type="text"
                          name="newContactCity"
                          id="newContactCity"
                          placeholder="Enter name of city"
                          onChange={this.handleInputChange}
                        />
                        <Label for="newContactState">State</Label>
                        <Input
                          type="text"
                          name="newContactState"
                          id="newContactState"
                          placeholder="Enter name of state"
                          onChange={this.handleInputChange}
                        />
                        <Label for="newContactZIP">ZIP code</Label>
                        <Input
                          type="text"
                          name="newContactZIP"
                          id="newContactZIP"
                          placeholder="Enter ZIP code"
                          onChange={this.handleInputChange}
                        />
                        <Label for="newContactCountry">Country</Label>
                        <Input
                          type="text"
                          name="newContactCountry"
                          id="newContactCountry"
                          placeholder="Enter name of country"
                          onChange={this.handleInputChange}
                        />
                        <b style={styles.note}>
                          Click on the plus icon to add more locations
                        </b>
                        <br />
                        <div style={styles.FaPlus}>
                          <FaPlus onClick={this.addLocation} />{" "}
                        </div>
                        <span>
                          <div id="notifyLocationAdded" style={styles.notify}>
                            New location has been added!
                          </div>
                          <div
                            id="removeLocationNotification"
                            style={styles.removeContactNotification}
                            onClick={() => {
                              document.getElementById(
                                "removeLocationNotification"
                              ).style.display = "none";
                              document.getElementById(
                                "notifyLocationAdded"
                              ).style.display = "none";
                            }}
                          >
                            x
                          </div>
                        </span>
                      </Form>

                      <hr />

                      <Form id="equipmentsAlwaysAvailable">
                        <Label for="equipmentsAlwaysAvailable">
                          Equipments already available on site
                        </Label>
                        {equipmentsAlwaysOnSite.map((x, index) => (
                          <div>
                            <input
                              type="checkbox"
                              id={equipmentIDs[index]}
                              name={x}
                              onClick={this.handleInputChange}
                            />{" "}
                            {x}
                          </div>
                        ))}
                      </Form>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.saveCompany}>
                      Save company
                    </Button>
                    <Button color="secondary" onClick={this.toggleModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>

              {this.state.validCompanyName ? (
                <FaCheckCircle style={styles.FaCheck} />
              ) : (
                <FaTimesCircle style={styles.FaTimes} />
              )}
            </FormGroup>
            <FormGroup>
              <Label for="dateOfRequest">Date of Request</Label>
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                name="startDate"
                placeholder="Enter date of request"
              />
            </FormGroup>
            <FormGroup>
              <Label for="validThru">Request valid until (YYYY-MM-DD)</Label>
              <Input
                type="text"
                name="validThru"
                id="validThru"
                placeholder="Quote valid till YYYY-MM-DD"
                value={this.state.validThru}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="paymentForTraining">
                Who is paying for the Service?
              </Label>
              <Input
                type="select"
                name="paymentForTraining"
                id="paymentForTraining"
                onChange={this.handleInputChange}
              >
                <option name="paymentForTraining" value={""}>
                  Choose an option
                </option>
                <option name="paymentForTraining" value={"Producer"}>
                  Producer
                </option>
                <option name="paymentForTraining" value={"Contract"}>
                  Contract
                </option>
                <option name="paymentForTraining" value={"Direct Sale"}>
                  Direct Sale
                </option>
                <option name="paymentForTraining" value={"ARCA"}>
                  ARCA
                </option>
              </Input>
              {this.state.paymentForTraining ? (
                <FaCheckCircle style={styles.FaCheck} />
              ) : (
                <FaTimesCircle style={styles.FaTimes} />
              )}
            </FormGroup>
            <FormGroup>
              <Label for="producer">Producer</Label>
              <Input
                type="select"
                name="producer"
                id="producer"
                onChange={this.handleInputChange}
              >
                <option>Choose producer</option>
                {getCompanyDetails.map(x => (
                  <option name="producer" value={x.producer}>
                    {x.producer}
                  </option>
                ))}
              </Input>
              <Label for="producer">Producer not listed? Enter here</Label>
              <Input
                type="text"
                name="producer"
                id="producer"
                placeholder="Enter other producer's name"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <Form>
              <Label for="topic">Add Services</Label>
              <div>
                <Button color="primary" onClick={this.toggleServiceModal}>
                  Add Services
                </Button>
                <Modal
                  isOpen={this.state.serviceModal}
                  toggle={this.toggleServiceModal}
                  className={this.props.className}
                >
                  <ModalHeader toggle={this.toggleServiceModal}>
                    Add Services
                  </ModalHeader>
                  <ModalBody>
                    <Form id="addService">
                    <FormGroup>
                      <Label for="service">Services</Label>
                      <Input
                          type="select"
                          name="service"
                          id="service"
                          onChange={this.handleInputChange}
                          onClick = {() => {
                            if(this.state.service === "Training"){
                              this.setState({
                                showTopics: true
                              });
                            }
                            else{
                              this.setState({
                                showTopics: false
                              });
                            }
                            this.getPriceAndQuantity();
                          }}
                        >
                          <option name="service" value={""}>
                            Choose a service
                          </option>
                          <option name = "Training" value="Training" onClick = {() => {
                            this.setState({showTopics: true});
                          }}>Training</option>
                          {this.state.listOfServices.map(x => (
                            <option value={x.service}>
                              {x.service}
                            </option>
                          ))}
                        </Input>
                        {(this.state.service === "") ? <div>
                        <Label for="newService">New Service? Enter it here</Label>
                        <Input
                          type="text"
                          name="service"
                          id="service"
                          onChange={this.handleInputChange}
                          placeholder = "Enter New Service's Name"
                        />
                        <Label for="newServiceDescription">Enter new service's description</Label>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          onChange={this.handleInputChange}
                          placeholder = "Enter New Service's Description"
                        />
                        <Label for="newServiceCostPerUnit">Enter new service's cost per unit</Label>
                        <Input
                          type="text"
                          name="costForService"
                          id="costForService"
                          onChange={this.handleInputChange}
                          placeholder = "Enter New Service's cost per unit"
                        />
                        </div> : <div>
                        <br/>
                      <Button id="Popover1" onClick={this.togglePopOver}>
                        Read more about the Service
                      </Button>
                      <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.togglePopOver}>
                        <PopoverHeader id = "serviceName">{this.state.service}</PopoverHeader>
                        <PopoverBody id = "description">{this.state.description}</PopoverBody>
                      </Popover>
                      </div>}
                        
                    </FormGroup>
                    {this.state.showTopics === true? <div>
                      <FormGroup>
                        <Label for="topic">Topic</Label>
                        <Input
                          type="select"
                          name="topic"
                          id="topic"
                          onChange={this.handleInputChange}
                          onClick={this.getPriceAndQuantity}
                        >
                          <option name="topic" value={""}>
                            Choose a topic
                          </option>
                          {this.state.topicsVsEquipments.map(x => (
                            <option name="topic" value={x.topic}>
                              {x.topic}
                            </option>
                          ))}
                        </Input>
                        {this.state.topic.length > 0 &&
                        this.state.topic !== "Other" ? (
                          <FaCheckCircle style={styles.FaCheck} />
                        ) : (
                          <FaTimesCircle style={styles.FaTimes} />
                        )}
                      </FormGroup>

                      <FormGroup>
                        <Label for="newtopic">
                          New Topic? Enter the topic below
                        </Label>{" "}
                        <br />
                        <Input
                          type="text"
                          name="topic"
                          id="newTopic"
                          placeholder="Enter new topic's name"
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                      </div> : ""}
                      <br/>
                      <FormGroup>
                        <Label for="billable">Billable Service</Label> <br />
                        <input
                          type="checkbox"
                          id="billable"
                          name="billableService"
                          value={this.state.billableService}
                          defaultChecked
                          onClick={() =>
                            this.setState({
                              billableService: !this.state.billableService
                            })
                          }
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label for="costForService">Cost for Service</Label>{" "}
                        <br />
                        <Input
                          type="text"
                          name="costForService"
                          id="costForService"
                          placeholder="Enter the cost for the service"
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label for="alternateNameForService">
                          Alternate Name For Service
                        </Label>{" "}
                        <br />
                        <Input
                          type="text"
                          name="alternateName"
                          id="alternateNameForService"
                          placeholder="Enter alternate name for service"
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label for="durationInMin">
                          Duration of Service in Minutes
                        </Label>{" "}
                        <br />
                        <Input
                          type="text"
                          name="durationInMin"
                          id="durationInMin"
                          placeholder="Enter duration of service in minutes"
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label for="quantity">Number of Units of Service</Label>{" "}
                        <br />
                        <Input
                          type="text"
                          name="numServiceUnits"
                          id="numServiceUnits"
                          placeholder="Enter number of service units"
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                      <Button color="secondary" onClick={this.addService}>
                        Enter another service
                      </Button>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.saveServices}>
                      Save Services
                    </Button>{" "}
                    <Button color="secondary" onClick={this.toggleServiceModal}>
                      Close
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
              <br />
            </Form>
            {this.state.topic === "Training" ? (
              <FormGroup className="training" id="training">
                <Label for="address">Address of Training</Label>
                <br />
                <Label for="streetAddress">Street Address</Label>
                <Input
                  type="text"
                  name="streetAddress"
                  id="streetAddress"
                  placeholder="Street Address"
                  onChange={this.handleInputChange}
                />
                <Label for="zip">ZIP</Label>
                <Input
                  type="text"
                  name="zip"
                  id="zip"
                  placeholder="ZIP"
                  onChange={this.handleInputChange}
                />
                {this.state.validZIP > 0 ? (
                  <FaCheckCircle style={styles.FaCheck} />
                ) : (
                  <FaTimesCircle style={styles.FaTimes} />
                )}
                <br />
                <Label for="country">Country</Label>
                <Input
                  type="select"
                  name="country"
                  id="country"
                  onChange={this.handleInputChange}
                >
                  <option>United States</option>
                  {Object.keys(cities).map(country => (
                    <option>{country}</option>
                  ))}
                </Input>
                <Label for="state">State</Label>
                <Input
                  type="select"
                  name="state"
                  id="state"
                  onChange={this.handleInputChange}
                >
                  <option>Arizona</option>
                  {us_states.map(state => (
                    <option>{state}</option>
                  ))}
                </Input>
                <Label for="city">City</Label>
                <Input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Enter City"
                  onChange={this.handleInputChange}
                />

                <Label for="langOfTraining">Language of training</Label>
                <Input
                  type="select"
                  name="langTraining"
                  id="langTraining"
                  onChange={this.handleInputChange}
                >
                  <option name="langTraining" value="">
                    Choose a language of training
                  </option>
                  <option name="langTraining" value="English">
                    English
                  </option>
                  <option name="langTraining" value="Spanish">
                    Spanish
                  </option>
                  <option name="langTraining" value="Bilingual">
                    Bilingual
                  </option>
                </Input>

                <Label for="numStudents">Number of students</Label>
                <Input
                  type="text"
                  name="numStudents"
                  id="numStudents"
                  placeholder="Enter number of students"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            ) : (
              ""
            )}
            <FormGroup>
              <Label for="contactName">Contact Person's Name</Label>
              <Input
                type="select"
                name="contactName"
                id="contactName"
                placeholder="Enter contact name"
                onChange={this.handleInputChange}
              >
                <option key={"contactPerson"} value={""}>
                  Choose contact person's name
                </option>
                {getCompanyContacts.map((x, index) => (
                  <option key={"contact person" + index} value={x.contactName}>
                    {x.contactName}
                  </option>
                ))}
              </Input>
              <Label for="contactName">
                Name of contact not listed? Enter it here
              </Label>
              <Input
                type="text"
                name="contactName"
                id="contactNameNew"
                placeholder="Enter other contact's name"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="contactEmail">Contact Person's Email</Label>
              <Input
                type="select"
                name="contactEmail"
                id="contactEmail"
                placeholder="Valid email format example@test.com"
                onChange={this.handleInputChange}
              >
                <option key={"contactEmail"} value={""}>
                  Choose contact person's email
                </option>
                {getCompanyContacts.map((x, index) => (
                  <option
                    key={"contact_person_email" + index}
                    value={x.contactEmail}
                  >
                    {x.contactEmail}
                  </option>
                ))}
              </Input>
              <Label for="contactEmail">Email not listed? Enter it here</Label>
              <Input
                type="text"
                name="contactEmail"
                id="contactEmailNew"
                placeholder="Enter other contact's email ID"
                onChange={this.handleInputChange}
              />
              {this.state.validEmail ? (
                <FaCheckCircle style={styles.FaCheck} />
              ) : (
                <FaTimesCircle style={styles.FaTimes} />
              )}
            </FormGroup>
            <FormGroup>
              <Label for="contactPhone">Contact Person's Contact Number</Label>
              <br />
              <Input
                type="select"
                name="contactPhone"
                id="contactPhone"
                placeholder="Valid phone format example +1 (999) 999-999"
                onChange={this.handleInputChange}
              >
              <option value="">Choose Office Number</option>
              {this.state.companyOfficeContacts.map(x => <option value={x.contactOfficePhone}>{x.contactOfficePhone}</option>)}
              </Input>
              <Label for="contactPhone">Contact Person's Office Number not listed? Enter it here</Label>
              <br />
              <Input
                type="text"
                name="contactPhone"
                id="contactPhoneNew"
                placeholder="Valid phone format example +1 (999) 999-999"
                onChange={this.handleInputChange}
              />
              {this.state.validPhone ? (
                <FaCheckCircle style={styles.FaCheck} />
              ) : (
                <FaTimesCircle style={styles.FaTimes} />
              )}
            </FormGroup>
            <FormGroup>
              <Label for="contactCell">
                Contact Person's Cell phone number
              </Label>
              <Input
                type="select"
                name="contactCellPhone"
                id="contactCellPhone"
                placeholder="Valid phone format example +1 (999) 999-999"
                onChange={this.handleInputChange}
              >
              <option value="">Choose Mobile Phone</option>
              {this.state.companyMobileContacts.map(x => <option value={x.contactMobilePhone}>{x.contactMobilePhone}</option>)}
              </Input>
              <Label for="contactCell">
                Contact Person's Cell phone number not listed? Enter it here
              </Label>
              <Input
                type="text"
                name="contactCellPhone"
                id="contactCellPhone"
                placeholder="Valid phone format example +1 (999) 999-999"
                onChange={this.handleInputChange}
              />
              {this.state.validCellPhone ? (
                <FaCheckCircle style={styles.FaCheck} />
              ) : (
                <FaTimesCircle style={styles.FaTimes} />
              )}
            </FormGroup>
            <div>
              {this.state.topic === "Training" ? (
                <div>
                  <Label for="sameLocAsTraining">
                    Same Location as Training?{" "}
                  </Label>
                  <br />
                  <input
                    type="checkbox"
                    id="check"
                    name="sameLocAsTraining"
                    value={this.state.sameLocAsTraining}
                    defaultChecked = {false}
                    onChange={this.handleInputChange}
                    onClick={e => {
                      this.setState({
                        sameLocAsTraining: !this.state.sameLocAsTraining
                      });
                      if (this.state.sameLocAsTraining) {
                        this.setState({
                          contactStreetAddress: this.state.contactStreetAddress,
                          contactZip: this.state.contactZip,
                          contactCountry: this.state.contactCountry,
                          contactState: this.state.contactState,
                          contactCity: this.state.contactCity
                        });
                      }
                    }}
                  />
                </div>
              ) : (
                ""
              )}
              <br />
              {this.state.sameLocAsTraining ? (
                ""
              ) : (
                <FormGroup className="training" id="training">
                  <Label for="address">Contact Address</Label>
                  <br />
                  <Label for="streetAddress">Street Address</Label>
                  <Input
                    type="select"
                    name="contactStreetAddress"
                    id="contactStreetAddress"
                    placeholder="Street Address"
                    onChange={this.handleInputChange}>
                    <option value="">Choose Street Address</option>
                    {this.state.companyLocations.filter(x => x.contactStreetAddress !== undefined || x.contactStreetAddress.trim() !== "").map(
                      y => <option value={y.contactStreetAddress}>{y.contactStreetAddress}</option>
                    )}
                  </Input>
                  <Label for="streetAddress">Contact Street Address not listed? Enter it here</Label>
                  <Input
                    type="text"
                    name="contactStreetAddress"
                    id="contactStreetAddress"
                    placeholder="Street Address"
                    onChange={this.handleInputChange}
                  />
                  <Label for="contactZip">ZIP</Label>
                  <Input
                    type="select"
                    name="contactZip"
                    id="contactZip"
                    placeholder="ZIP code"
                    onChange={this.handleInputChange}>
                    <option value="">Choose ZIP</option>
                    {this.state.companyLocations.filter(x => x.contactZIP !== undefined || x.contactZIP.trim() !== "").map(
                      y => <option value={y.contactZIP}>{y.contactZIP}</option>
                    )}
                  </Input>
                  <Label for="contactZip">ZIP not listed? Enter it here</Label>
                  <Input
                    type="text"
                    name="contactZip"
                    id="contactZip"
                    placeholder="ZIP code"
                    onChange={this.handleInputChange}
                  />
                  <Label for="contactCountry">Country</Label>
                  <Input
                    type="select"
                    name="contactCountry"
                    id="contactCountry"
                    onChange={this.handleInputChange}
                  >
                    <option>United States</option>
                    {Object.keys(cities).map(country => (
                      <option>{country}</option>
                    ))}
                  </Input>
                  <Label for="contactState">State</Label>
                  <Input
                    type="select"
                    name="contactState"
                    id="contactState"
                    onChange={this.handleInputChange}
                  >
                    <option>Arizona</option>
                    {us_states.map(state => (
                      <option>{state}</option>
                    ))}
                  </Input>
                  <Label for="contactCity">City</Label>
                  <Input
                    type="text"
                    name="contactCity"
                    id="contactCity"
                    placeholder="Enter City"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label for="equipments">Equipment needed</Label> <br />
                <input
                  type="checkbox"
                  id="Laptop"
                  name="Laptop"
                  defaultChecked={this.state.Laptop}
                />
                Laptop <br />
                <input
                  type="checkbox"
                  id="projectorScreen"
                  name="projectorScreen"
                  defaultChecked={this.state.projectorScreen}
                />
                Projector Screen
                <br />
                <input
                  type="checkbox"
                  id="Table"
                  name="Table"
                  defaultChecked={this.state.Table}
                />
                Table
                <br />
                <input
                  type="checkbox"
                  id="forkliftTrainingKit"
                  name="forkliftTrainingKit"
                  defaultChecked={this.state.forkliftTrainingKit}
                />
                Forklift Training Kit (Grey Duffle Bag)
                <br />
                <input
                  type="checkbox"
                  id="trainingKit"
                  name="trainingKit"
                  defaultChecked={this.state.trainingKit}
                />
                Training Kit (Green Duffle Bag)
                <br />
                <input
                  type="checkbox"
                  id="CPRmannequins"
                  name="CPRmannequins"
                  defaultChecked={this.state.CPRmannequins}
                />
                CPR Mannequins
                <br />
                <input
                  type="checkbox"
                  id="firstAidAEDKit"
                  name="firstAidAEDKit"
                  defaultChecked={this.state.firstAidAEDKit}
                />
                First Aid AED Kit (Red bagpack)
                <br />
                <input
                  type="checkbox"
                  id="RespiratorFitTestKit"
                  name="RespiratorFitTestKit"
                  defaultChecked={this.state.RespiratorFitTestKit}
                />
                Respirator Fit Test Kit
                <br />
                <input
                  type="checkbox"
                  id="Handouts"
                  name="Handouts"
                  defaultChecked={this.state.Handouts}
                />
                Handouts
                <br />
                <Label for="additionalEquipment">
                  Need additional equipment? Add it here
                </Label>
                <div style={styles.FaPlus} id="clearText">
                  <Input
                    type="text"
                    name="addOn"
                    id="addOn"
                    value={this.state.addOn}
                    onChange={this.handleInputChange}
                  />
                  <FaPlus
                    onClick={() => {
                      if (this.state.addOn.trim() !== "") {
                        this.state.additionalEquipments.push(this.state.addOn.trim());
                        document.getElementById('addEquipment').style.display = "block";
                      }
                      else{
                        document.getElementById('addEquipment').style.display = "none";
                      }
                    }}
                  />{" "}
                </div>
                <Alert color="success" id="addEquipment">New equipment added! <span style={{'float':'right'}} onClick = {() => {
                  document.getElementById('addEquipment').style.display = "none";
                }}><FaTimes /></span></Alert>
              </FormGroup>
            </div>
            <FormGroup>
              <Label for="instructions">
                Provide instructions to service provider
              </Label>
              <Input
                type="textarea"
                name="instructions"
                id="instructions"
                placeholder="Instructions"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            
            <Button
              name="active"
              onClick={this.handleSubmit}
              disabled={!this.state.active}
            >
              Submit
            </Button>{" "}
            &nbsp;
            <Button onClick={this.handlePDF}>Print</Button>
          </Form>
          <br />

          <div>
            <div id="capture" style={styles.pdf}>
              <div>
                <div style={styles.info}>
                  Insure Compliance, LLC
                  <br />
                  4406 E Main St 102-58
                  <br />
                  Mesa, AZ 85205 US
                  <br />
                  (866) 647-2373
                  <br />
                  insurecompliance.net
                  <br />
                </div>
                <img
                  src="./Capture.PNG"
                  alt="Company logo"
                  style={styles.logo}
                />
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <div style={styles.content}>
                <h3 style={styles.quotation}>QUOTATION</h3>

                <div>
                  <div style={styles.billedTo}>
                    <b>ADDRESS</b>
                    <br />
                    {this.state.companyName}
                    <br />
                    {this.state.contactStreetAddress}
                    <br />
                    {this.state.contactCity}{" "}
                    {getInitial(this.state.contactState)}
                    {this.state.contactZip}
                    <br />
                  </div>

                  <div style={styles.quote}>
                    <b>QUOTATION</b> # 1023 &nbsp; <br />
                    <b>DATE</b>{" "}
                    <Moment format="YYYY/MM/DD" date={this.state.startDate} />{" "}
                    &nbsp; <br />
                  </div>
                </div>

                <br />
                <br />
                <br />
                <br />
                <hr style={styles.quotation} />

                <div>
                  <div style={styles.billedTo}>
                    <b>QUOTATION ISSUED BY</b> &nbsp;
                    {this.state.quotationIssuedBy}
                    <br />
                  </div>

                  <div style={styles.quote}>
                    <b>QUOTATION VALID THRU</b>&nbsp;
                    <Moment
                      format="YYYY/MM/DD"
                      date={this.state.validThru}
                    />{" "}
                    <br />
                  </div>
                </div>

                <br />
                <br />

                <table id="customers">
                  <tr>
                    <th>ACTIVITY</th>
                    <th>QTY</th>
                    <th>RATE</th>
                    <th>AMOUNT</th>
                  </tr>
                  <tbody>
                    {this.state.requestedServices.length > 0
                      ? this.state.requestedServiceRows
                      : ""}
                  </tbody>
                </table>

                <br />
                <hr style={styles.quotation} />
                <div style={styles.quote}>
                  <span style={{ fontSize: "1.25em" }}>
                    <b>TOTAL</b> <b>{"$" + this.state.totalCost.toFixed(2)}</b>
                  </span>
                </div>
                <br />
                <br />
                <div>
                  <div style={styles.billedTo}>
                    <b>Accepted by</b>
                  </div>

                  <div style={styles.quote}>
                    <b>Accepted Date</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

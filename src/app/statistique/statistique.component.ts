import { VerifyAccessPrivilegesService } from './../auth/verify-access-privileges.service';
import { MonthlyCount } from './../exchange/model/monthly_count';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss']
})
export class StatistiqueComponent implements OnInit {

  incomes = 0;
  outcomes = 0;

  nombreClients = 0;
  nombreFournisseurs = 0;
  nombreOuvriers = 0;
  nombreProduits = [];

  nombreCommandesClientParMois: MonthlyCount[] = [];
  moisLabels: string[] = [];
  nombreCommandesClient: number[] = [];

  LineChart = [];

  constructor(private route: ActivatedRoute, private verifyAccessPrivs: VerifyAccessPrivilegesService) { }

  ngOnInit() {
    this.verifyAccessPrivs.verify();

    this.incomes = this.route.snapshot.data.incomes;
    this.outcomes = this.route.snapshot.data.outcomes;

    console.log(this.incomes);
    console.log(this.outcomes);

    this.nombreClients = this.route.snapshot.data.nombreClients;
    this.nombreFournisseurs = this.route.snapshot.data.nombreFournisseurs;
    this.nombreOuvriers = this.route.snapshot.data.nombreOuvriers;

    this.nombreCommandesClientParMois = this.route.snapshot.data.nombreCommandesClientParMois;

    this.nombreCommandesClientParMois.forEach(element => {
      this.moisLabels.push(element.month + '/' + element.year);
      this.nombreCommandesClient.push(element.count);
    });

    // Line chart
    this.initLineChart();
  }

  initLineChart() {
    this.LineChart = new Chart('linechart', {
      type: 'line',
      data: {
        labels: this.moisLabels,
        datasets: [{
          label: 'عدد الطلبات',
          display: false,
          data: this.nombreCommandesClient,
          fill: false,
          lineTension: 0.4,
          borderColor: 'white',
          borderWidth: 4
        }]
      },
      options: {
        legend: {
          labels: {
            fontColor: 'white'
          }
        },
        title: {
          text: 'عدد طلبات الزبائن بدلالة الأشهر',
          display: false,
          fontColor: 'white'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: 'white'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
            }
          }]
        }
      }
    });
  }

  getCommandeClientWithMinMaxCount(): MonthlyCount[] {
    let min = this.nombreCommandesClientParMois[0];
    let max = this.nombreCommandesClientParMois[0];

    this.nombreCommandesClientParMois.forEach(item => {
      min = (item.count < min.count) ? item : min;
      max = (item.count > max.count) ? item : max;
    });
    return [min, max];
  }

  getCommandeClientWithMaxCountMsg(): string {
    const maxCmd = this.getCommandeClientWithMinMaxCount()[1];
    if (maxCmd) {
      return 'أعلى عدد طلبات : ' + maxCmd.count + ' (شهر : ' + maxCmd.month + '/' + maxCmd.year + ')';
    }
    return;
  }

  getCommandeClientWithMinCountMsg(): string {
    const minCmd = this.getCommandeClientWithMinMaxCount()[0];
    if (minCmd) {
      return 'أقل عدد طلبات : ' + minCmd.count + ' (شهر : ' + minCmd.month + '/' + minCmd.year + ')';
    }
    return;
  }

}

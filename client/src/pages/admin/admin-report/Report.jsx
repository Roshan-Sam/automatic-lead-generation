import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import {
    BarChart,
    Bar,
    Brush,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import axios from "axios";
import config from "../../../Functions/config";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'

const Report = () => {

    const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext()
    const [allPlans, setAllPlans] = useState()
    const [companySubscriptionPlans, setCompanySubscriptionPlans] = useState()
    const [products, setProducts] = useState()
    const [selectValue, setSelectValue] = useState('Bar Chart')




    useEffect(() => {
        fetchAllPlans()
        fetchProducts()
        fetchCompanySubscriptionPlans()
    }, [])


    const fetchAllPlans = async () => {

        try {
            const res = await axios.get(`${config.baseApiUrl}admin/add-plan/`)
            if (res.status === 200) {
                
                setAllPlans(res.data)
            }
        } catch (error) {
            console.log(error)
        }

    }


    const fetchCompanySubscriptionPlans = async () => {
        try {
            const res = await axios.get(
                `${config.baseApiUrl}admin/subscriptions/`
            );
            if (res.status === 200) {
                
                setCompanySubscriptionPlans(res.data.company_subscriptions);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(
                `${config.baseApiUrl}admin/product-features/`
            );
            if (res.status === 200) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const sidebarToggle = () => {
        sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
    };


    const getMonthName = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('default', { month: 'long' });
    }

    const subscriptionPlans = allPlans && allPlans.map((plan) => plan.name)

    const getMonthData = (monthlysubscriptionplans, data) => {
        const monthdata = data
        subscriptionPlans && subscriptionPlans.forEach((plan) => {
            monthdata[plan] = 0
        })
        monthlysubscriptionplans && monthlysubscriptionplans.forEach((plan) => {

            let planname = plan.subscription_plan.plan_name
            if (monthdata[planname]) {
                monthdata[planname] += 1;
            } else {
                monthdata[planname] = 1
            }
            let planproductname = planname + plan.subscription_plan.product.name
            if (monthdata[planproductname]) {
                monthdata[planproductname] += 1;
            } else {
                monthdata[planproductname] = 1
            }
        })
        
        return monthdata
    }

    const jansubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'January')
    const febsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'February')
    const marchsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'March')
    const aprilsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'April')
    const maysubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'May')
    const junesubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'June')
    const julysubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'July')
    const augsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'August')
    const sepsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'September')
    const octsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'October')
    const novsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'November')
    const decsubscriptionplans = companySubscriptionPlans && companySubscriptionPlans.filter((plan) => getMonthName(plan.start_date) === 'December')


    const data = [

        getMonthData(jansubscriptionplans, { name: 'January' }),
        getMonthData(febsubscriptionplans, { name: 'February' }),
        getMonthData(marchsubscriptionplans, { name: 'March' }),
        getMonthData(aprilsubscriptionplans, { name: 'April' }),
        getMonthData(maysubscriptionplans, { name: 'May' }),
        getMonthData(junesubscriptionplans, { name: 'June' }),
        getMonthData(julysubscriptionplans, { name: 'July' }),
        getMonthData(augsubscriptionplans, { name: 'August' }),
        getMonthData(sepsubscriptionplans, { name: 'September' }),
        getMonthData(octsubscriptionplans, { name: 'October' }),
        getMonthData(novsubscriptionplans, { name: 'November' }),
        getMonthData(decsubscriptionplans, { name: 'December' })
    ]

    const totalProductSubscriptions=(array)=>{
        return array && array.map((prodtplan)=>{

            return {
                name: prodtplan,
                value: data.reduce((sum, item) =>{
                    const value=item[prodtplan]
                    return sum + (typeof value === 'number' ? value : 0)
                },0)
            }

        })
    }

    const detailedData={}
    companySubscriptionPlans && companySubscriptionPlans.forEach((plan)=>{
        if(!detailedData[plan.subscription_plan.plan_name]){
            detailedData[plan.subscription_plan.plan_name]=[]
        }

        detailedData[plan.subscription_plan.plan_name].push(plan.subscription_plan.plan_name+plan.subscription_plan.product.name)
    })

    for (let key in detailedData){
        detailedData[key]=totalProductSubscriptions(detailedData[key])
    }

    



    const totalSubscriptions = subscriptionPlans && subscriptionPlans.map(plan => {

        return {
            name: plan,
            value: data.reduce((sum, item) => sum + item[plan], 0)
        }
    })


    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57', '#8dd1e1', '#ffbb28', '#ff8042', '#d0d0d0'];

    const assignColorsToPlans = (plans) => {
        const planColors = {};
        plans && plans.forEach((plan, index) => {
            planColors[plan] = colors[index % colors.length];
        });
        return planColors;
    };


    const planColors = assignColorsToPlans(subscriptionPlans);

    const customToolTip = ({ active, payload, label }) => {

        if (active && payload && payload.length) {

            const monthData = payload[0].payload

            return (
                <div className='bg-white p-2'>
                    <p className="mb-1">{`Month: ${label}`}</p>
                    {subscriptionPlans && subscriptionPlans.map((plan) => {
                        return (
                            <p style={{ color: planColors[plan] }}>{plan}:{monthData[plan]}</p>
                        )
                    })}

                    {Object.keys(monthData).map((key) => {
                        if (key !== 'name' && !subscriptionPlans.includes(key)) {
                            return <p key={key} className='text-gray-500'>{`${key}: ${monthData[key]}`}</p>;
                        }
                        return null;
                    })}
                </div>
            )
        }
    }

    const customToolTip2=({active,payload})=>{

           if(active&&payload&&payload.length){
               const {name,value}=payload[0]
               const details=detailedData[name] || []

               return(
                  <div className='bg-white p-2'>
                      <p style={{ color: planColors[name] }}>{name}:{value}</p>
                      {details.length>0 && details.map((detail)=>(
                          <p key={detail.name} className='text-gray-500'>{detail.name}:{detail.value}</p>
                      ))}
                  </div>
               )
           }
    }


    const downloadpdf=()=>{
        
        const input=document.getElementById('chart')
        console.log(input)

        if (!input) {
            console.error('Chart element not found');
            return;
        }

        html2canvas(input, { useCORS: true })
         .then((canvas)=>{
            console.log('hello');
            const imgData=canvas.toDataURL('image/png');

            const chartWidth=canvas.width;
            const chartHeight=canvas.height;

            const pdf=new jsPDF({
                orientation:chartWidth>chartHeight ? 'landscape':'portrait',
                unit:"px",
                format:[chartWidth,chartHeight],
            });

            pdf.addImage(imgData,'PNG',0,0,chartWidth,chartHeight);
            pdf.save('chart.pdf');
          })
          .catch((error) => {
            console.error('Error capturing the chart:', error);
          });

    }

    const downloadexcel=()=>{
        const worksheet=selectValue==='Pie Chart' ? XLSX.utils.json_to_sheet(totalSubscriptions) : XLSX.utils.json_to_sheet(data)
        const workbook=XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook,worksheet,'Chart Data')
        XLSX.writeFile(workbook,'chart.xlsx')
    }

    const convertToCSV=(data1)=>{

        const array=[Object.keys(data1[0])].concat(data1);

        return array.map((row)=>{
            return Object.values(row).toString()
        }).join('\n')
    }

    const downloadcsv=()=>{
        const csvdata=selectValue==='Pie Chart' ? convertToCSV(totalSubscriptions) : convertToCSV(data)
        const blob=new Blob([csvdata],{type:'text/csv;charset=utf-8;'})
        const link=document.createElement("a");

        if (link.download !== undefined){
            const url=URL.createObjectURL(blob);
            link.setAttribute("href",url);
            link.setAttribute("download","chart_data.csv");
            link.style.visibility='hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }



    return (
        <>
            <div className="bg-[rgb(16,23,42)]">
                <AdminNav />
                <div className="flex min-h-screen pt-20">
                    <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-50">
                        <AdminSidebar sidebarToggle={sidebarToggle} />
                    </div>
                    <div
                        className={`flex-1 min-h-screen overflow-auto transition-all duration-300 z-40 ${isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
                            }`}
                    >

                        <div className="mt-8">
                            <div className="flex justify-end mb-8">
                                <select value={selectValue} className="bg-[rgb(16,23,42)] text-white mr-8 px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent" onChange={(e) => setSelectValue(e.target.value)}>
                                    <option hidden>Select Chart</option>
                                    <option value='Bar Chart' className="text-black">Bar Chart</option>
                                    <option value='Line Chart' className="text-black">Line Chart</option>
                                    <option value='Pie Chart' className="text-black">Pie Chart</option>
                                </select> 

                            </div>

                            <div className="flex justify-end mb-8">

                                <button className="text-white border border-gray-500 rounded p-3 mr-4" onClick={downloadpdf}><i class="fa-solid fa-file-pdf fa-lg"></i>&nbsp;PDF</button>
                                <button className="text-white border border-gray-500 rounded p-3 mr-4" onClick={downloadexcel}><i class="fa-solid fa-file-excel fa-lg"></i>&nbsp;EXCEL</button>
                                <button className="text-white border border-gray-500 rounded p-3 mr-8" onClick={downloadcsv}><i class="fa-solid fa-file-csv fa-lg"></i>&nbsp;CSV</button>
                            </div>


                            {selectValue === 'Bar Chart' && <ResponsiveContainer width="100%" height={500} id={selectValue==='Bar Chart'?'chart':''}>
                                <BarChart
                                    width={600}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 20, right: 30, left: 20, bottom: 5,
                                    }}
                                    
                                    
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis ticks={[0, 1, 2, 3, 4]} />
                                    <Tooltip content={customToolTip} />
                                    <Legend />
                                    {subscriptionPlans && subscriptionPlans.map((plan) => (
                                        <Bar key={plan} dataKey={plan} fill={planColors[plan]} />
                                    ))}
                                    <Brush dataKey="name" height={30} stroke="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>}

                            {selectValue === 'Line Chart' && <ResponsiveContainer width="100%" height={500} id={selectValue==='Line Chart'?'chart':''}>

                                <LineChart
                                    width={600}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 20, right: 30, left: 20, bottom: 5,
                                    }}
                                    
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis ticks={[0, 1, 2, 3, 4]} />
                                    <Tooltip content={customToolTip} />
                                    <Legend />
                                    {subscriptionPlans && subscriptionPlans.map((plan) => (
                                        <Line key={plan} type="monotone" dataKey={plan} stroke={planColors[plan]} />
                                    ))}

                                    <Brush dataKey="name" height={30} stroke="gray" />

                                </LineChart>


                            </ResponsiveContainer>}




                            {selectValue === 'Pie Chart' && <ResponsiveContainer width="100%" height={500} id={selectValue==='Pie Chart'?'chart':''}>

                                <PieChart >
                               

                                    <Pie
                                        data={totalSubscriptions}
                                        dataKey='value'
                                        nameKey='name'
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={200}
                                        fill="green"
                                        label
                                    >

                                        {totalSubscriptions && totalSubscriptions.map((plan, index) => (
                                            <Cell key={`cell-${index}`} fill={planColors[plan.name]} />
                                        ))}

                                    </Pie>

                                    <Tooltip content={customToolTip2} />
                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>}



                        </div>

                    </div>
                </div>

            </div>

        </>
    )
}

export default Report
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace FindWorker_App
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class Main_MasterDetailPage : MasterDetailPage
	{
		public Main_MasterDetailPage ()
		{
			InitializeComponent();
            Detail = new NavigationPage(new PinPage());
            IsPresented = false;
		}

        private void btnMap_Clicked(object sender, EventArgs e)
        {
            new NavigationPage(new PinPage());
        }
    }
}
using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace FindWorker_App
{
    public class MapsPage : ContentPage
    {
        public MapsPage()
        {
            var l = new Label
            {
                Text = "These buttons leave the current app and open the built-in Maps app for the platform"
            };

            var openLocation = new Button
            {
                Text = "Open location using built-in Maps app"
            };
            openLocation.Clicked += (sender, e) =>
            {

                if (Device.RuntimePlatform == Device.iOS)
                {
                    Device.OpenUri(new Uri("http://maps.apple.com/?q=394+Pacific+Ave+San+Francisco+CA"));
                }
                else if (Device.RuntimePlatform == Device.Android)
                {
                    Device.OpenUri(new Uri("geo:0,0?q=394+Pacific+Ave+San+Francisco+CA"));

                }
                else if (Device.RuntimePlatform == Device.UWP)
                {
                    Device.OpenUri(new Uri("bingmaps:?where=394 Pacific Ave San Francisco CA"));
                }
            };

            var openDirections = new Button
            {
                Text = "Get directions using built-in Maps app"
            };
            openDirections.Clicked += (sender, e) =>
            {

                if (Device.RuntimePlatform == Device.iOS)
                {

                    Device.OpenUri(new Uri("http://maps.apple.com/?daddr=San+Francisco,+CA&saddr=cupertino"));

                }
                else if (Device.RuntimePlatform == Device.Android)
                {

                    Device.OpenUri(new Uri("http://maps.google.com/?daddr=San+Francisco,+CA&saddr=Mountain+View"));

                }
                else if (Device.RuntimePlatform == Device.UWP)
                {
                    Device.OpenUri(new Uri("bingmaps:?rtp=adr.394 Pacific Ave San Francisco CA~adr.One Microsoft Way Redmond WA 98052"));
                }
            };
            Content = new StackLayout
            {
                Padding = new Thickness(5, 20, 5, 0),
                HorizontalOptions = LayoutOptions.Fill,
                Children = {
                    l,
                    openLocation,
                    openDirections
                }
            };
        }
    }
}

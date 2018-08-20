using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using Xamarin.Forms;
using Xamarin.Forms.Maps;

namespace FindWorker_App
{
        public class MapsApi : ContentPage
        {
            Map map;
            public MapsApi()
            {
                map = new Map
                {
                    HeightRequest = 100,
                    WidthRequest = 960,
                    VerticalOptions = LayoutOptions.FillAndExpand
                };


                map.MoveToRegion(new MapSpan(new Position(0, 0), 360, 360));


                var slider = new Slider(1, 18, 1);
                slider.ValueChanged += (sender, e) => {
                    var zoomLevel = e.NewValue;
                    var latlongdegrees = 360 / (Math.Pow(2, zoomLevel));
                    Debug.WriteLine(zoomLevel + " -> " + latlongdegrees);
                    if (map.VisibleRegion != null)
                        map.MoveToRegion(new MapSpan(map.VisibleRegion.Center, latlongdegrees, latlongdegrees));
                };


                var street = new Button { Text = "Street" };
                var hybrid = new Button { Text = "Hybrid" };
                var satellite = new Button { Text = "Satellite" };
                street.Clicked += HandleClicked;
                hybrid.Clicked += HandleClicked;
                satellite.Clicked += HandleClicked;
                var segments = new StackLayout
                {
                    Spacing = 30,
                    HorizontalOptions = LayoutOptions.CenterAndExpand,
                    Orientation = StackOrientation.Horizontal,
                    Children = { street, hybrid, satellite }
                };


                var stack = new StackLayout { Spacing = 0 };
                stack.Children.Add(map);
                stack.Children.Add(slider);
                stack.Children.Add(segments);
                Content = stack;


                map.PropertyChanged += (sender, e) => {
                    Debug.WriteLine(e.PropertyName + " just changed!");
                    if (e.PropertyName == "VisibleRegion" && map.VisibleRegion != null)
                        CalculateBoundingCoordinates(map.VisibleRegion);
                };

            }
            void HandleClicked(object sender, EventArgs e)
            {
                var b = sender as Button;
                switch (b.Text)
                {
                    case "Street":
                        map.MapType = MapType.Street;
                        break;
                    case "Hybrid":
                        map.MapType = MapType.Hybrid;
                        break;
                    case "Satellite":
                        map.MapType = MapType.Satellite;
                        break;
                }
            }


            static void CalculateBoundingCoordinates(MapSpan region)
            {
                var center = region.Center;
                var halfheightDegrees = region.LatitudeDegrees / 2;
                var halfwidthDegrees = region.LongitudeDegrees / 2;

                var left = center.Longitude - halfwidthDegrees;
                var right = center.Longitude + halfwidthDegrees;
                var top = center.Latitude + halfheightDegrees;
                var bottom = center.Latitude - halfheightDegrees;

                if (left < -180) left = 180 + (180 + left);
                if (right > 180) right = (right - 180) - 180;

                Debug.WriteLine("Bounding box:");
                Debug.WriteLine("                    " + top);
                Debug.WriteLine("  " + left + "                " + right);
                Debug.WriteLine("                    " + bottom);
            }
        }
    }

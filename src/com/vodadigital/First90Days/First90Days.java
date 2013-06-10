/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.vodadigital.First90Days;

import java.util.Set;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

public class First90Days extends DroidGap {
	public static final String WEEKANDDAY = "WEEKANDDAY";

	@Override
    public void onCreate(Bundle savedInstanceState) {
		/* clicking on a notification brings us through here.  how do we get at information associated with the event? */
        super.onCreate(savedInstanceState); 
        super.loadUrl(Config.getStartUrl());
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        Bundle extras = getIntent().getExtras();
        Log.d("First90Days", "inside onCreate()");
        if (extras != null) {
	        Set<String> keys = extras.keySet();
			for (String key : keys) {
				Log.d("First90Days", "***** We found extras *****  key [" + key + "] has value [" + extras.get(key) + "]");
			}
			String weekAndDay = extras.getString(WEEKANDDAY);
			if (weekAndDay != null) {
				Log.d("First90Days", "***** Launched from a notification.");
//				Log.d("First90Days", "calling receivedLocalNotification");
				try {
					Thread.sleep(4000);
					this.sendJavascript("receivedLocalNotification();");
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} finally {
//					Log.d("First90Days", "returned from call to receivedLocalNotification");
				}
			} else {
				Log.d("First90Days", "***** Launched manually.");
			}
        }// else {
//        	Log.d("First90Days", "**** extras was null");
//        }
    }
	
	/**
	 * This prevents the app to change orientation when the device gets rotated.
	 */
	@Override
	public void onConfigurationChanged(Configuration newConfig) {
	    super.onConfigurationChanged(newConfig);
	    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
	}
	
	@Override
	protected void onNewIntent (Intent intent) {
		Log.d("First90Days", "**************** inside onNewIntent()");
	}
}


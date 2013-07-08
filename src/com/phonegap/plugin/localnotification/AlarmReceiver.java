package com.phonegap.plugin.localnotification;

import java.util.Calendar;
import java.util.Set;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

// Import your.package.R here
import com.vodadigital.First90Days.First90Days;
import com.HBR.First90Days.R;

/**
 * The alarm receiver is triggered when a scheduled alarm is fired. This class
 * reads the information in the intent and displays this information in the
 * Android notification bar. The notification uses the default notification
 * sound and it vibrates the phone.
 * 
 * @author dvtoever
 * @author Matthew C. Rice <mrice@rcs.us>
 */
public class AlarmReceiver extends BroadcastReceiver {

	public static final String TITLE = "ALARM_TITLE";
	public static final String SUBTITLE = "ALARM_SUBTITLE";
	public static final String TICKER_TEXT = "ALARM_TICKER";
	public static final String NOTIFICATION_ID = "NOTIFICATION_ID";

	/* Contains time in 24hour format 'HH:mm' e.g. '04:30' or '18:23' */
	public static final String HOUR_OF_DAY = "HOUR_OF_DAY";
	public static final String MINUTE = "MINUTES";
	public static final String WEEKANDDAY = "WEEKANDDAY";

	@Override
	public void onReceive(Context context, Intent intent) {
		Log.d("AlarmReceiver", "AlarmReceiver invoked!");
		final Bundle bundle = intent.getExtras();
//		Log.d("AlarmReceiver", "extras contains [" + bundle.toString() + "]");
		Set<String> keys = bundle.keySet();
		for (String key : keys) {
			Log.d("AlarmReceiver", "key [" + key + "] has value [" + bundle.get(key) + "]");
		}
		final Object systemService = context.getSystemService(Context.NOTIFICATION_SERVICE);
		// Retrieve notification details from the intent
		final String tickerText = bundle.getString(TICKER_TEXT);
		final String notificationTitle = bundle.getString(TITLE);
		final String notificationSubText = bundle.getString(SUBTITLE);
		int notificationId = 0;
		try {
			notificationId = Integer.parseInt(bundle.getString(NOTIFICATION_ID));
		} catch (Exception e) {
			Log.d("AlarmReceiver", "Unable to process alarm with id: " + bundle.getString(NOTIFICATION_ID) + " because of exception [" + e.getMessage() + "]");
		}
		Calendar currentCal = Calendar.getInstance();
		int alarmHour = bundle.getInt(HOUR_OF_DAY);
		int alarmMin = bundle.getInt(MINUTE);
		int currentHour = currentCal.get(Calendar.HOUR_OF_DAY);
		int currentMin = currentCal.get(Calendar.MINUTE);
		if (currentHour != alarmHour && currentMin != alarmMin) {
			/*
			 * If you set a repeating alarm at 11:00 in the morning and it
			 * should trigger every morning at 08:00 o'clock, it will
			 * immediately fire. E.g. Android tries to make up for the
			 * 'forgotten' reminder for that day. Therefore we ignore the event
			 * if Android tries to 'catch up'.
			 */
			Log.d(LocalNotification.PLUGIN_NAME, "AlarmReceiver, ignoring alarm since it is due");
			return;
		}
		// Construct the notification and notificationManager objects
		final NotificationManager notificationMgr = (NotificationManager) systemService;
		final Notification notification = new Notification(R.drawable.icon, tickerText, System.currentTimeMillis());
		Intent i = new Intent(context, First90Days.class);
		/* Here we are pulling the WEEKANDDAY value from the alarm intent and adding it to a new intent that will launch our First90Days activity. */
		Log.d("AlarmReceiver", "putting WEEKANDDAY into the intent with value [" + bundle.getString(First90Days.WEEKANDDAY) + "]");
		i.putExtra(First90Days.WEEKANDDAY, bundle.getString(First90Days.WEEKANDDAY));
		final PendingIntent contentIntent = PendingIntent.getActivity(context, 0, i, 0);
		notification.defaults |= Notification.DEFAULT_SOUND;
		notification.vibrate = new long[] { 0, 100, 200, 300 };
		notification.setLatestEventInfo(context, notificationTitle, notificationSubText, contentIntent);
		/*
		 * If you want all reminders to stay in the notification bar, you should
		 * generate a random ID. If you want to replace an existing
		 * notification, make sure the ID below matches the ID that you store in
		 * the alarm intent.
		 */
		notificationMgr.notify(notificationId, notification);
	}
}

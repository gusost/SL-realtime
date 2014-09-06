#include <pebble.h>
#include "ticker.h"

// GG. 
#define NUMBER_OF_RIDES 4
#define CELL_HEIGHT 38

static Window *window;
//static TextLayer *text_layer;
//static TextLayer *ride_layer;
//static char ride[50];

// GG. Make a struct that has text layers, time keeping and inversion layer.
typedef struct Transport {
	Layer			*container;
	InverterLayer	*inverter_layer;
	Ticker			*ticker;
	TextLayer 		*transport_mode_and_line_number;
	char 			 transport_mode_and_line_number_text[20];
	TextLayer 		*destination;
	char 			 destination_text[26];
	TextLayer 		*time_left;
	char 			 time_left_text[7];	// GG. In case it's copied to the text layers, only need one string.
	uint32_t 		tabledTime;
	uint32_t 		expectedTime;
	int 			index;		// GG. Index.
} Transport;

enum {
	REALTIME_KEY_TEST			= 0x0,
	REALTIME_KEY_FETCH			= 0x1,
	REALTIME_KEY_TRANSPORT_MODE	= 0x2,
	REALTIME_KEY_STOP_NAME		= 0x3,
	REALTIME_KEY_LINE_NUMBER	= 0x4,
	REALTIME_KEY_DESTINATION	= 0x5,
	REALTIME_KEY_TABLED_TIME	= 0x6,
	REALTIME_KEY_EXPECTED_TIME	= 0x7,
	REALTIME_KEY_INDEX			= 0x8
// GG. One more for total amount?
};

static Transport tpLayers[NUMBER_OF_RIDES];

//static void updateTpLayer(Transport *transport) {
/*
	animal_data->count++;
	time_t now = time(NULL);
	data_logging_log(animal_data->logging_session, (uint8_t *)&now, 1);
	snprintf(animal_data->text, 20, "%d", animal_data->count);
	text_layer_set_text(animal_data->text_layer, animal_data->text);

	text_layer = text_layer_create((GRect) { .origin = { 0, 12 }, .size = { bounds.size.w, 20 } });
	text_layer_set_text(text_layer, "Press a button");
	text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
	layer_add_child(window_layer, text_layer_get_layer(text_layer));
*/
//}

static void init_transport_layer(Transport *transport, int i) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "Init transport layer: %d", i);
	Layer *window_layer = window_get_root_layer(window);
	GRect bounds = layer_get_bounds(window_layer);
	transport->container = layer_create((GRect) { .origin = { 0, i * (CELL_HEIGHT) }, .size = { bounds.size.w, CELL_HEIGHT } });

	// GG. Transport mode and line number
	transport->transport_mode_and_line_number = text_layer_create((GRect) { .origin = { 0, 0 - 5 }, .size = { (int) bounds.size.w * 2 / 3, CELL_HEIGHT / 2 - 1 } });
	text_layer_set_text(transport->transport_mode_and_line_number, "Transport mode and line number");
	text_layer_set_text_alignment(transport->transport_mode_and_line_number, GTextAlignmentLeft);
	text_layer_set_font(transport->transport_mode_and_line_number, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
	text_layer_set_background_color(transport->transport_mode_and_line_number, GColorClear);
	layer_add_child(transport->container, text_layer_get_layer(transport->transport_mode_and_line_number));

	// GG. Time left
	transport->time_left = text_layer_create((GRect) { .origin = { bounds.size.w * 2 / 3, 0 - 5 }, .size = { bounds.size.w / 3, CELL_HEIGHT / 2 - 1 } });
	text_layer_set_text(transport->time_left, "XX min");
	text_layer_set_text_alignment(transport->time_left, GTextAlignmentRight);
	text_layer_set_font(transport->time_left, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
	text_layer_set_background_color(transport->time_left, GColorClear);
	layer_add_child(transport->container, text_layer_get_layer(transport->time_left));

	// GG. Destination
	transport->destination = text_layer_create((GRect) { .origin = { 0, 10 }, .size = { bounds.size.w, CELL_HEIGHT * 2 / 3 } });
	text_layer_set_text(transport->destination, "Pretty long text for destination");
	text_layer_set_text_alignment(transport->destination, GTextAlignmentLeft);
	text_layer_set_font(transport->destination, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
	text_layer_set_background_color(transport->destination, GColorClear);
	layer_add_child(transport->container, text_layer_get_layer(transport->destination));
	
	// GG. Ticker
	transport->ticker = ticker_layer_create(); // ticker_layer_create(expectedTime);
	layer_add_child(transport->container, transport->ticker->backgroundLayer);
	
	if (i%2) {
		transport->inverter_layer = inverter_layer_create((GRect) {.origin = { 0, 0 }, .size = { bounds.size.w, CELL_HEIGHT }});
		layer_add_child(transport->container, inverter_layer_get_layer(transport->inverter_layer));
	}
	layer_add_child(window_layer, transport->container);
}

static void destroy_transport_layer(Transport *transport, int i) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "Destroy layer: %i", i);
	text_layer_destroy(		transport->transport_mode_and_line_number);
	text_layer_destroy(		transport->destination);
	text_layer_destroy(		transport->time_left);
	if (i%2) inverter_layer_destroy(transport->inverter_layer);
	layer_destroy(transport->container);
}

static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
//	text_layer_set_text(text_layer, "Getting data...");
	// GG. Get new data.
	Tuplet fetch_tuple = TupletInteger(REALTIME_KEY_FETCH, 1);
	DictionaryIterator *iter;
	app_message_outbox_begin(&iter);
	if (iter == NULL) return;
	dict_write_tuplet(iter, &fetch_tuple);
	dict_write_end(iter);
	app_message_outbox_send();
}
/*
static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
//	text_layer_set_text(text_layer, "Up");
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
//	text_layer_set_text(text_layer, "Down");
}
*/

static void click_config_provider(void *context) {
	window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
//	window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
//	window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
}

static void in_received_handler(DictionaryIterator *iter, void *context) {
//	Tuple *ride_tuple = dict_find(iter, REALTIME_KEY_TEST);
	Tuple *transport_mode_tuple = dict_find(iter, REALTIME_KEY_TRANSPORT_MODE);
/*
	if (ride_tuple) {
		strncpy(ride, ride_tuple->value->cstring, 50);
		text_layer_set_text(ride_layer, ride);
	}
*/
	if(transport_mode_tuple) {
		/* Tuple *stop_name_tuple = dict_find(iter, REALTIME_KEY_STOP_NAME); */
		Tuple *line_number_tuple	= dict_find(iter, REALTIME_KEY_LINE_NUMBER);
		Tuple *destination_tuple	= dict_find(iter, REALTIME_KEY_DESTINATION);
//		Tuple *tabled_time_tuple	= dict_find(iter, REALTIME_KEY_TABLED_TIME);
		Tuple *expected_time_tuple	= dict_find(iter, REALTIME_KEY_EXPECTED_TIME);
		Tuple *index_tuple			= dict_find(iter, REALTIME_KEY_INDEX);
		int i = index_tuple->value->int32;

		Transport *transport = &tpLayers[i];

		strncpy(transport->transport_mode_and_line_number_text, transport_mode_tuple->value->cstring, 20);
		if( strncmp(transport->transport_mode_and_line_number_text, "BUS", 5) == 0)
			strncpy(transport->transport_mode_and_line_number_text, "Buss", 20);	
		else if( strncmp(transport->transport_mode_and_line_number_text, "METRO", 5) == 0)
			strncpy(transport->transport_mode_and_line_number_text, "Tunnelbana", 20);	
		else if( strncmp(transport->transport_mode_and_line_number_text, "TRAM", 5) == 0)
			strncpy(transport->transport_mode_and_line_number_text, "Lokalbana", 20);	
		else if( strncmp(transport->transport_mode_and_line_number_text, "TRAIN", 5) == 0)
			strncpy(transport->transport_mode_and_line_number_text, "Tåg ", 20);	
		
		strcat (transport->transport_mode_and_line_number_text, " ");
		strcat (transport->transport_mode_and_line_number_text, line_number_tuple->value->cstring);
		text_layer_set_text(transport->transport_mode_and_line_number, transport->transport_mode_and_line_number_text);
		
		time_t t = time(NULL);
		transport->expectedTime = expected_time_tuple->value->int32;
		int timeLeft = transport->expectedTime - t;
		snprintf(transport->time_left_text, 7, "%i min", (int) (timeLeft / 60));
//		snprintf(transport->time_left_text, 7, "%02i:%02i", (int) (timeLeft / 60), abs(timeLeft) % 60);
		
		text_layer_set_text(transport->time_left, transport->time_left_text);

		strncpy(transport->destination_text, destination_tuple->value->cstring, 26);
		text_layer_set_text(transport->destination, transport->destination_text);
		
		transport->ticker->progress.value = transport->expectedTime;
	}
}
static void handle_tick(struct tm *tick_time, TimeUnits units_changed) {
	time_t t = time(NULL);
	for(int i = 0; i < NUMBER_OF_RIDES; i++)
	{
		Transport *transport = &tpLayers[i];
		int timeLeft = transport->expectedTime - t;
		
		if(timeLeft % 60 == 59 || timeLeft % 60 == 0)
		{
	//		if(timeLeft < 0)
			snprintf(transport->time_left_text, 7, "%i min", (int) (timeLeft / 60));
	//			snprintf(transport->time_left_text, 7, "-%02i:%02i", (int) (abs(timeLeft) / 60), abs(timeLeft) % 60);
	//		else
	//			snprintf(transport->time_left_text, 7, "%02i:%02i",  (int) (timeLeft / 60), timeLeft % 60);
			text_layer_set_text(transport->time_left, transport->time_left_text);
		}

		ProgressData *data = layer_get_data(transport->ticker->layer);
		data->value = (abs(timeLeft) % 60) * 2;
		layer_mark_dirty(transport->ticker->layer);
		if(t % 25 == 0) select_click_handler(NULL, NULL); // GG. Fetch data... same routine.
		
	}
}
static void in_dropped_handler(AppMessageResult reason, void *context) {
	switch(reason) {
	case APP_MSG_BUSY :
		APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Dropped: Busy.");
		break;
	case APP_MSG_BUFFER_OVERFLOW :
		APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Dropped: Buffer overflow.");
		break;
	default :
		APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Dropped: : %d", reason);	
}

}

static void out_failed_handler(DictionaryIterator *failed, AppMessageResult reason, void *context) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Failed to Send!");
}

static void app_message_init(void) {
	// Register message handlers
	app_message_register_inbox_received(in_received_handler);
	app_message_register_inbox_dropped(in_dropped_handler);
	app_message_register_outbox_failed(out_failed_handler);
	// Init buffers
	app_message_open(APP_MESSAGE_INBOX_SIZE_MINIMUM, 64);
//	fetch_msg();
}

static void window_load(Window *window) {
	for(int i = 0; i < NUMBER_OF_RIDES; i++)
	{
		Transport *transport = &tpLayers[i];
		init_transport_layer(transport, i);
	}
}

static void window_unload(Window *window) {
	for(int i = 0; i < NUMBER_OF_RIDES; i++)
	{
		Transport *transport =	&tpLayers[i];
		destroy_transport_layer(transport, i);
	}
}

static void init(void) {
	window = window_create();
	app_message_init();
	window_set_click_config_provider(window, click_config_provider);
	window_set_window_handlers(window, (WindowHandlers) {
		.load = window_load,
		.unload = window_unload,
	});
	const bool animated = true;
	tick_timer_service_subscribe(SECOND_UNIT, handle_tick);
	window_stack_push(window, animated);
}

static void deinit(void) {
	window_destroy(window);
}

int main(void) {
	init();

	APP_LOG(APP_LOG_LEVEL_DEBUG, "Done initializing, pushed window: %p", window);

	app_event_loop();
	deinit();
}

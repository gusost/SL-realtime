#include <pebble.h>

#include "ticker.h"

#define CELL_HEIGHT 38
//typedef void (*TickerCallback)(char *name);
//static bool halfSecond = false;

Ticker* ticker_layer_create(){
	// GG. Using malloc, remember to free() it laterzz. why not uniq?
	Ticker *ticker = (Ticker *)malloc( sizeof( Ticker ) );
/*		.layer			 = layer_create_with_data((GRect) { .origin = { 1, 1 }, .size = { 120, 1 } }, sizeof(ProgressData)),
						.backgroundLayer = layer_create((GRect) { .origin = { 11, CELL_HEIGHT - 4 }, .size = { 122, 3 } }), 
								 = { .value = 0 }};
*/
	APP_LOG(APP_LOG_LEVEL_DEBUG, "Init ticker layer: %p", ticker);
	ticker->layer			 = layer_create_with_data((GRect) { .origin = { 1, 1 }, .size = { 120, 2 } }, sizeof(ProgressData));
	ticker->backgroundLayer  = layer_create((GRect) { .origin = { 12, CELL_HEIGHT - 5 }, .size = { 120, 4 } });
	ticker->progress		 = (ProgressData) { .value = 0 };
	layer_set_update_proc(ticker->layer, tickerDraw);
	layer_set_update_proc(ticker->backgroundLayer, tickerBackgroundDraw);
// 	GG. Attach the acctual ticker layer as child. Return background layer.

	layer_add_child(ticker->backgroundLayer, ticker->layer);
	return ticker;
}
/*
typedef struct Ticker {
	Layer *layer;				// The ticker for the clock
	Layer *backgroundLayer;	// The ticker for the clock
	ProgressData progress;
} Ticker;

typedef struct {
	int value; 
} ProgressData;
*/
void tickerDraw(Layer *layer, GContext *ctx) {

	graphics_context_set_stroke_color(ctx, GColorBlack);
	ProgressData *data = layer_get_data(layer);

//	time_t t = time(NULL);
//	int timeLeft = data->value - t;
//	(ticker->value - t);

// GG. Time left could be negative. Needs to start incrementing instead to indicate the transport is behind expectation.
//	if (timeLeft <= 0)  timeLeft = halfSecond ? 0 - (timeLeft * 2) - 1	: 0 - (timeLeft * 2);
//	else				timeLeft = halfSecond ? 1 + (timeLeft * 2)		: 0 + (timeLeft * 2);
//	timeLeft %= 120;
//	APP_LOG(APP_LOG_LEVEL_DEBUG, "Time left: %i", timeLeft);
//	graphics_draw_line( ctx , GPoint(0, 0), GPoint(timeLeft, 0) );

	graphics_draw_rect( ctx, GRect(0, 0, data->value, 2));
}

void tickerBackgroundDraw(Layer *layer, GContext *ctx) {
	//	graphics_context_set_stroke_color(ctx, GColorWhite);
	graphics_context_set_stroke_color(ctx, GColorBlack);
	graphics_draw_rect( ctx, GRect(0,0,120,4));	
}

/*
void handle_timer(AppContextRef ctx, AppTimerHandle handle, uint32_t cookie) {
	halfSecond = true;
	layer_mark_dirty(&tickerLayer);
}
*/

void ticker_deinit(void);
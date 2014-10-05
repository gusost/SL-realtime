#pragma once

// typedef void (*TickerCallback)(char *name);

typedef struct ProgressData {
	int value;
} ProgressData;

typedef struct Ticker {
	Layer *layer;				// The ticker for the clock
	Layer *backgroundLayer;	// The ticker for the clock
	ProgressData progress;
} Ticker;


void tickerDraw(Layer *ticker, GContext *ctx);
void tickerBackgroundDraw(Layer *layer, GContext *ctx);

Ticker* ticker_layer_create();

void ticker_deinit(Ticker* ticker);

// void ticker_get_name(char *name, TickerCallback cb);

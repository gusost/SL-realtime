#include <pebble.h>
#include "transport.h"
#include "ticker.h"
#define CELL_HEIGHT 38
#define CELL_WIDTH 144

void init_transport_layer(Transport *transport, int i) {

	APP_LOG(APP_LOG_LEVEL_DEBUG, "Init transport layer: %d", i);

	transport->container = layer_create((GRect) { .origin = { 0, i * (CELL_HEIGHT) }, .size = { CELL_WIDTH, CELL_HEIGHT } });

	// GG. Transport mode and line number
	transport->transport_mode_and_line_number = text_layer_create((GRect) { .origin = { 0, 0 - 5 }, .size = { (int) CELL_WIDTH * 2 / 3, CELL_HEIGHT / 2 - 1 } });
	text_layer_set_text(transport->transport_mode_and_line_number, "");
	text_layer_set_text_alignment(transport->transport_mode_and_line_number, GTextAlignmentLeft);
	text_layer_set_font(transport->transport_mode_and_line_number, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
	text_layer_set_background_color(transport->transport_mode_and_line_number, GColorClear);
	layer_add_child(transport->container, text_layer_get_layer(transport->transport_mode_and_line_number));

	// GG. Time left
	transport->time_left = text_layer_create((GRect) { .origin = { CELL_WIDTH * 2 / 3, 0 - 5 }, .size = { CELL_WIDTH / 3, CELL_HEIGHT / 2 - 1 } });
	text_layer_set_text(transport->time_left, "");
	text_layer_set_text_alignment(transport->time_left, GTextAlignmentRight);
	text_layer_set_font(transport->time_left, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
	text_layer_set_background_color(transport->time_left, GColorClear);
	layer_add_child(transport->container, text_layer_get_layer(transport->time_left));

	// GG. Destination
	transport->destination = text_layer_create((GRect) { .origin = { 0, 10 }, .size = { CELL_WIDTH, CELL_HEIGHT * 2 / 3 } });
	text_layer_set_text(transport->destination, "");
	text_layer_set_text_alignment(transport->destination, GTextAlignmentLeft);
	text_layer_set_font(transport->destination, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
	text_layer_set_background_color(transport->destination, GColorClear);
	layer_add_child(transport->container, text_layer_get_layer(transport->destination));
	
	// GG. Ticker
	transport->ticker = ticker_layer_create(); // ticker_layer_create(expectedTime);
	layer_add_child(transport->container, transport->ticker->backgroundLayer);
	
	if (i%2) {
		transport->inverter_layer = inverter_layer_create((GRect) {.origin = { 0, 0 }, .size = { CELL_WIDTH, CELL_HEIGHT }});
		layer_add_child(transport->container, inverter_layer_get_layer(transport->inverter_layer));
	}
}

void destroy_transport_layer(Transport *transport, int i) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "Destroy layer: %i", i);
	text_layer_destroy(		transport->transport_mode_and_line_number);
	text_layer_destroy(		transport->destination);
	text_layer_destroy(		transport->time_left);
	ticker_deinit(transport->ticker);
	free(transport->ticker);
	if (i%2) inverter_layer_destroy(transport->inverter_layer);
	layer_destroy(transport->container);
}

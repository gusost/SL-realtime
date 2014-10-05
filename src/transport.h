#pragma once
#include "ticker.h"

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

void init_transport_layer(Transport *transport, int i);
void destroy_transport_layer(Transport *transport, int i);
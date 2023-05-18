---
title: Storing History Using Store and Forward
sidebar_position: 3
---

The store and forward system works as a pipeline to deliver data reliably to the database. The database is a data sink, and data is buffered in the store and forward engine using a mixture of memory and disk storage, until it can be delivered. If the data results in an error, it is quarantined in order to allow other data to pass. While it is buffered, it may be combined with similar data, in order to improve efficiency by writing in bulk transactions instead of individual units.

Modules have the ability to feed data into the store and forward system, either by using existing framework classes or by defining new types of data whose storage functions can be customized.

## The Core Pieces

At its heart, a store and forward pipeline consists of a DataSink and HistoricalData. The data sink receives the historical data. Both of these interfaces are extended and implemented by numerous pieces that operate in different manners, but fundamentally the historical data is generated, and passed through a series of sinks. Since a sink can only receive data, most sinks are extended to be a DataStore as well. DataStores are sinks, but can also provide back the data in the form of TransactionSets, which are simply lists of ForwardTransactions. A ForwardTransaction is a wrapper around a piece of HistoricalData, with functions for reporting success or failure.

## Accessing the Store and Forward System

The store and forward system is managed by the HistoryManager, provided by the GatewayContext. The history manager is used to put data in the system for a particular pipeline, as well as to register new data sinks.

## Storing Data

There are currently two types of data flavors that are supported by the default store and forward engines: tag history data, and datasource data. The tag history data, clearly, is used to store Tag History data, and defined by the HistoricalTagValue and implemented by BasicHistoricalTagValue, and the slightly more efficient PackedHistoricalTagValue. To store history for tags, you can use either of these classes and send them to the history manager for the datasource you want to store to.

More commonly, however, modules will want to store general database data. The DatasourceData interface provides a flexible method for storing arbitrary data. After passing through the store and forward system, storeToConnection() is called with an open connection. The implementation of the data can then do anything that it needs to do to store the data.
If you simply want to store a basic row of data in an existing table, you can save yourself some work and use the BasicHistoricalRecord class. It allows you to define columns, and then add rows of data. It supports multiple rows of data at once, stores efficiently in the data cache, and automatically groups with like data to form efficient transactions. The columns are defined by the `HistoricalColumn` interface, and there are two general purpose implementations, the `ValueHistoricalColumn` for most values, and the `LiteralHistoricalColumn` for including a keyword in the query.
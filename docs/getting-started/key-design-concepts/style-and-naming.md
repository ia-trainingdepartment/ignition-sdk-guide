---
title: Style and Naming Conventions
sidebar_position: 7
---
In general, the Ignition platform follows the recommendations of the Oracle Code Conventions for the [Java Programming Language](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html). Most of the interfaces and classes in the Ignition platform are named using the standard casing. Some items, however, have names that are products of their history, which may make them a bit confusing. The following list tries to identify inconsistent or legacy naming schemes that module writers are likely to encounter:

* **factorysql or factorypmi packages**, or the abbreviations "fsql" and "fpmi" in identifiers. 

    These products were the predecessors to the SQL Bridge and Vision modules respectively, and these names still show up in code fairly regularly.

* **"SR*"** naming convention. 

    During early development, Ignition was referred to as "ScadaRail". This led to many classes being named with the initial abbreviation **SR**, a practice that has been abandoned, but not completely reversed.
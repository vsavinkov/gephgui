#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;
use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::process::Command;
use std::sync::{Arc, Mutex};

fn get_daemon_name() -> String {
  String::from("geph-client")
}

fn main() {
  let mapping = Arc::new(Mutex::new(HashMap::new()));
  tauri::AppBuilder::new()
    .invoke_handler(move |_webview, arg| {
      use cmd::Cmd::*;
      match serde_json::from_str(arg) {
        Err(e) => Err(e.to_string()),
        Ok(command) => {
          match command {
            // definitions for your custom commands from Cmd here
            StartBinderProxy { callback, error } => tauri::execute_promise(
              _webview,
              {
                let mapping = mapping.clone();
                move || {
                  let mut mapping = mapping.lock().unwrap();
                  let daemon_name = get_daemon_name();
                  let dhandle = Command::new(&daemon_name)
                    .arg("-binderProxy")
                    .arg("127.0.0.1:23456")
                    .spawn()?;
                  let id = dhandle.id();
                  mapping.insert(dhandle.id(), dhandle);
                  Ok(id)
                }
              },
              callback,
              error,
            ),
            StopBinderProxy { id } => {
              let mut mapping = mapping.lock().unwrap();
              let entry = mapping.entry(id);
              if let Entry::Occupied(v) = entry {
                let (_, mut v) = v.remove_entry();
                let _ = v.kill();
                let _ = v.wait();
              }
            }
            CheckAccount { callback, error } => println!("callback={}, error={}", callback, error),
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}

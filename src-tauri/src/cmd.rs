use serde::Deserialize;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  // your custom commands
  // multiple arguments are allowed
  // note that rename_all = "camelCase": you need to use "myCustomCommand" on JS
  StartBinderProxy { callback: String, error: String },
  StopBinderProxy { id: u32 },
  CheckAccount { callback: String, error: String },
}

use std::fmt::{self, Display, Formatter};

use annotate_snippets::snippet::AnnotationType;
use rustpython_parser::ast::{Located, StmtKind};

use crate::{
    errors::{CompilerOutput, CreateLocation, Location},
    source_map::SourceMapped,
    Error,
};

#[derive(Clone, Debug)]
pub struct FirstParamMustBeSelf {
    pub location: Location,
}

impl FirstParamMustBeSelf {
    pub fn err_from_stmt(stmt_kind: &SourceMapped<&Located<StmtKind>>) -> Error {
        Self {
            location: stmt_kind.create_location(),
        }
        .into()
    }
}

impl From<FirstParamMustBeSelf> for Error {
    fn from(value: FirstParamMustBeSelf) -> Self {
        Self::FirstParamMustBeSelf(value)
    }
}

impl Display for FirstParamMustBeSelf {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let title =
            "method must be an instance method. Add \"self\" as the first parameter".to_string();
        let annotation = "".to_string();
        let suggestion = None;

        write!(
            f,
            "{}",
            CompilerOutput {
                title,
                location: self.location.clone(),
                annotation,
                suggestion,
            }
            .to_string(AnnotationType::Error),
        )
    }
}
